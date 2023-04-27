// @ts-check
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";
import ProductModel from "./models/Product.js";
import Shop from './models/Shop.js';

import * as dotenv from 'dotenv';
import { productTypes } from "./models/ProductTypes.js";
import multer from "multer";
import cors from 'cors';

import { google } from "googleapis";
dotenv.config();

function makeid(l) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < l) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const keys = {
  cliendId: process.env.CLIEND_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_url: process.env.REDIRECT_URL
};

const oauth2Client = new google.auth.OAuth2(
  keys.cliendId,
  keys.client_secret,
  keys.redirect_url
);
 
google.options({
  auth: oauth2Client
});

const people = google.people('v1');

const googleScopes = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'profile'
];

const authGoogleUrl = oauth2Client.generateAuthUrl({
  scope: googleScopes.join(' ')
});

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || '', 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`; 

const PROXY_PATH = `${process.cwd()}/frontend/product-builder/src`;

const imageStorage = multer.diskStorage({
  destination: './frontend/product-builder/src/uploads',
  filename: function (req, file, cb) {
    const { originalname } = file;

    cb(null, originalname);
  },
});
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1048576 * 10
  }
});

const app = express();

app.use(cors())

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res, next) => {
                        const shop = new Shop({
      session: res.locals.shopify.session,
      name: res.locals.shopify.session.shop
    });

    const isExists = await Shop.exists({ name: res.locals.shopify.session.shop });

    if (!isExists) {
      await shop.save();
    } 

    next();
  },
  shopify.redirectToShopifyOrAppRoot()
);
app.post( 
  shopify.config.webhooks.path,
  // @ts-ignore
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.get("/product-builder", (req, res) => {
  res.sendFile(join(PROXY_PATH, 'builder.html')); 
});

app.get('/product-builder/product', async (req, res) => {
  const { id } = req.query;

  const product = await ProductModel.findOne({ shopify_id: `gid://shopify/Product/${id}` });

  res.send(product); 
})

app.get('/product-builder/products', async (req, res) => {
  const products = await ProductModel.find({});

  res.send(products);
});
 
app.post('/product-builder/uploads', imageUpload.single('images') ,async (req, res) => {
  const file = req.file;

  if (!file) {
    res.send(400);
  } else {
    res.send(file.originalname);
  }  
});
 
app.use('/product-builder', express.static(PROXY_PATH));

app.get('/api/socialAuth', async (req, res) => {
  res.send(200);
});

app.use('/api/googleOAth', async (req, res) => {
  const { code, state } = req.query;

  if (code && typeof code === 'string' && state && typeof state === 'string') {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    try {
    const person = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,photos,names'
    }).then(res => res.data);

    // const shop = 

    // const customers = await shopify.api.rest.Customer.all({});

    console.log(person);
    } catch(e) {
      console.log(e) 
    }

    const id = makeid(150);

    res.redirect(state + `?code=${id}`);
    return;
  }

  res.sendStatus(400); 
})

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json()); 

app.get('/api/shopify/products', async (req, res) => {
  const { query, noRelated } = req.query;  

  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session, 
    apiVersion: LATEST_API_VERSION
  });  

  const data = await client.query({
    data: `{
      products (first: 50, query: "title:${query}*") {
        edges {
          node {
            id 
            title
            handle
            image: featuredImage {
              url
              altText
            }
            options (first: 3) {
              id,
              name,
              values
            }
          }
        }
      }
    }`
  });

  // @ts-ignore
  const products = data.body.data.products.edges
    .map(item => item.node);

  if (noRelated) {
    const customProducts = await ProductModel.find({}); 

    const noRelatedProducts = products
      .filter(product => customProducts.every(cProd => cProd.shopify_id !== product.id));

    res.status(200).send(noRelatedProducts);
    return;
  }
    
  res.status(200).send(products);
});

app.get('/api/products', async (req, res) => {
  const { id } = req.query;

  const shop = await Shop.findOne({ name: res.locals.shopify.session.shop });

  if (id) {
    const product = await ProductModel.findOne({ shopify_id: id, shop: shop?._id });

    if (product) {
      res.status(200).send(product);
      return;
    }

    res.sendStatus(400);
    return;
  }

  const products = await ProductModel.find({ shop: shop?._id});

  res.status(200).send(products);
});

app.post('/api/products', async (req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
    apiVersion: LATEST_API_VERSION
  });
  console.log(res.locals.shopify.session);

  const { id, title, image, handle, options } = req.body;

  const shop = await Shop.findOne({ name: res.locals.shopify.session.shop });

  const product = new ProductModel({
    shopify_id: id,
    shop: shop?._id,
    title,
    imageUrl: image?.url,
    handle, 
    status: 'active',
    options
  });

  const isExists = await ProductModel.exists({ shopify_id: id });

  if (!isExists) {
    const CustomProduct = await product.save();

    await client.query({
      data: `
      mutation {
        metafieldsSet(metafields: {
          ownerId: "${id}",
          namespace: "custom",
          key: "builder_id",
          value: "${CustomProduct._id.valueOf()}",
        }) {
          metafields {
            id
            key
            namespace
          }
        }
      }`
    });

    res.status(201).send({ id, title, imageUrl: image?.url , handle});
    return;
  }

  res.sendStatus(400); 
});  

app.post('/api/products/update', async (req, res) => {
  const state = req.body;

  const { id } = req.query; 

  const currType = productTypes[state.type];

  if (!currType) { 
    res.sendStatus(400);
    return;
  }

  console.log(state.relatedProducts); 

  await ProductModel.findOneAndUpdate({ shopify_id: id }, {
    type: {
      id: currType?.id,
      title: currType?.title
    },
    status: state.status,
    settings: state.settings,
    relatedProducts: state.relatedProducts
  });

  const product = await ProductModel.findOne({ shopify_id: id });

  res.status(200).send(product);
})

app.get('/api/product/delete', async (req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
    apiVersion: LATEST_API_VERSION
  }); 

  const { id } = req.query;

  if (!id) {
    res.sendStatus(400);
  }

  const deleted = await ProductModel.deleteOne({ shopify_id: id });

  const fieldToDelete = await client.query({
    data: `
    query {
      product(id: "${id}") {
        metafield(key: "builder_id", namespace: "custom") {
          id
          value
        }
      }
    }`
  }).then(res => res.body.data.product.metafield ? res.body.data.product.metafield.id : null);

  if (fieldToDelete) {
    await client.query({
      data: `
      mutation {
        metafieldDelete(input: {
          id: "${fieldToDelete}"
        }) {
          deletedId
        }
      }`
    })
  }
 
  res.status(200).send(deleted);
})

app.get('/api/types', (req, res) => {
  res.send(productTypes);
})

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
