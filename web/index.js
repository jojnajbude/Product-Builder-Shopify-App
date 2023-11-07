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
import cors from 'cors'; 

import GetCode from "./utils/makeCode.js";
import { encryptPassword, decryptPassword } from "./utils/password_hashing.js";

import { google } from "googleapis";
import Customer from "./models/Customer.js";

import productBuilder from "./routes/product-builder.js";
import Order from "./models/Order.js";

import { create } from 'express-handlebars';

import mongoose from "./database/index.js";
import { shopRegister, webhookProductUpdate, webhookProductsDelete, webhookRegister } from "./controllers/index.js";

dotenv.config();

const googleKeys = {
  cliendId: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET, 
  redirect_url: process.env.GOOGLE_REDIRECT_URL,
  scopes: process.env.GOOGLE_SCOPES
};

const metaKeys = {
  facebook: {
    client_id: process.env.FACEBOOK_APP_ID
  },
  instagram: {
    client_id: process.env.INSTAGRAM_APP_ID,
    client_secret: process.env.INSTAGRAM_APP_SECRET
  }
}

const oauth2Client = new google.auth.OAuth2( 
  googleKeys.cliendId,
  googleKeys.client_secret,
  googleKeys.redirect_url
);
 
google.options({
  auth: oauth2Client
}); 

const people = google.people('v1');

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || '', 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

const hbs = create({
  helpers: {
    switch(value, options) {
      this.switch_value = value; 
      return options.fn(this); 
    },
    case(value, options) { 
      if (value == this.switch_value) {
        return options.fn(this);
      }
    },
    assign(name, value, options) {
      if (!options.data.root) {
        options.data.root = {};
      }
      options.data.root[name] = value;
    },
    contains(needle, haystack, options){
      return (haystack.indexOf(needle) !== -1) ? options.fn(this) : options.inverse(this);
    },
    includes(needle, haystack, options) {
      return (haystack.includes(needle)) ? options.fn(this) : options.inverse(this);
    },
    imageCrop(value) {
      return 1 + (Math.round((value / 50) * 100) / 100);
    },
    json(value) {
      return JSON.stringify(value);
    }
  },
  partialsDir: './product-builder/partials'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'product-builder');

app.use(cors()); 
  
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopRegister,
  webhookRegister,
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  // @ts-ignore
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);
 
// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use('/product-builder', productBuilder);

app.post('/api/customers/create', express.json(), async (req, res) => {
  const { email, id } = req.body;
  
  const customer = await Customer.findOne({ email: email });

  if (customer) {
    customer.set('shopify_id', id);

    customer.save();
  }

  res.sendStatus(200);
});

app.get('/api/customers/all', async(req, res) => {
  const customers = await Customer.find({});

  res.send(customers); 
})

app.post('/api/customers/delete', express.json(), async (req, res) => {
  const { email, id } = req.body;
  
  await Customer.deleteOne({ email: email });

  res.sendStatus(200);
});

app.use('/api/social/*', express.json()); 

app.get('/api/social/credentials', (req, res) => { 
  res.send({
    google: {
      id: googleKeys.cliendId,
      redirect: googleKeys.redirect_url,
      scopes: googleKeys.scopes,
    },
    facebook: {
      id: process.env.FACEBOOK_APP_ID
    },
    instagram: {
      id: process.env.INSTAGRAM_APP_ID,
      secret: process.env.INSTAGRAM_APP_SECRET
    }
  })
})

app.post('/api/social/login', async (req, res) => {
  const { code, shop: shopName } = req.body;

  const customer = await Customer.findOne({ authCode: code });

  if (!customer || (customer && customer.authCode === null)) {
    res.status(400).send({
      error: 'Code has been expired'
    });
    return;
  }

  const shop = await Shop.findOne({ name: shopName });

  if (customer) { 
    customer.set('authCode', null);
    await customer.save();
  }

  res.status(200).send({
    email: customer.email,
    password: decryptPassword(customer.password, process.env.PASSWORD_SECRET)
  });
});

app.post('/api/social/register', async (req, res) => {
  const { code, shop: shopName } = req.body; 

  const customer = await Customer.findOne({ authCode: code });

  if (!customer || (customer && customer.authCode === null)) {
    res.status(400).send({
      error: 'Code has been expired'
    });
    return;
  }

  const shop = await Shop.findOne({ name: shopName });

  const shopifyCustomer = await shopify.api.rest.Customer.search({
    session: shop?.session,
    query: `email:${customer.email}`,
  }).then(data => data.customers);

  const password = encryptPassword(GetCode(20), process.env.PASSWORD_SECRET);

  if (customer) {
    customer.set('password', password)
    customer.set('authCode', null);

    await customer.save();
  }

  res.status(200).send({
    email: customer?.email,
    password: decryptPassword(password, process.env.PASSWORD_SECRET),
    name: customer.name,
    lastName: customer.lastName
  });
}); 

app.use('/api/handle-register', express.json(), async (req, res) => {
  const { email, password, name, lastName} = req.body;

  if (!email || !password) {
    res.sendStatus(400);
    return;
  } 

  const isExist = await Customer.findOne({
    email,
  });

  if (isExist) {
    res.sendStatus(400);
    return;
  } 
 
  const newCustomer = new Customer({
    authCode: null,
    email: email,
    name: name || null,
    lastName: lastName || null,
    password: encryptPassword(password, process.env.PASSWORD_SECRET)
  });

  await newCustomer.save();

  res.sendStatus(200);
});

app.use('/api/recover', express.json(), async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.sendStatus(400);
  }

  const customer = await Customer.findOne({ email: email });

  if (customer) {
    await customer.set('socials', []).save();

    res.sendStatus(200);
    return;
  }

  res.sendStatus(400);
});

app.use('/api/googleOAth', async (req, res) => {
  const { code, state } = req.query;

  if (!state || !code) {
    res.sendStatus(400);
    return;
  }

  const { redirect, shop: shopName, action } = typeof state === 'string'
    ? JSON.parse(state)
    : null;

  if (code && typeof code === 'string' && state && typeof state === 'string') {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    try {
    const person = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,photos,names'
    }).then(res => res.data);

    const shop = await Shop.findOne({ name: shopName }); 

    const personEmail = person.emailAddresses?.find(email => {
      return email.metadata?.primary
    });

    const customers = await shopify.api.rest.Customer.search({
      session: shop?.session,
      query: `email:${personEmail?.value}`,
      fields: 'email, id'
    }).then(data => data.customers);

    const isExists = await Customer.findOne({ email: personEmail?.value });

    const isGoogleLinked = isExists?.socials.some(social => social.name === 'google');

    const id = GetCode(150);

    if (customers.length === 0 && !isExists && action === 'register') {
      let personName, personLastName;

      if (person.names) {
        personName = person.names[0].givenName;
        personLastName = person.names[0].familyName;
      };

      const newCustomer = new Customer({
        authCode: id,
        email: personEmail?.value,
        name: personName,
        lastName: personLastName,
        socials: [{
          name: 'google',
          credentionals: oauth2Client.credentials
        }]
      });

      await newCustomer.save();
    } else if (isExists && isGoogleLinked && action === 'login') {
      isExists.set('authCode', id);
      await isExists.save();
    } else if (isExists && action === 'register') {
      if (redirect.includes('?')) { 
        res.redirect(redirect + `&error=userExists`);
      } else {
        res.redirect(redirect + `?error=userExists`);
      }

      return;
    } else if (isExists && !isGoogleLinked && action === 'login') {
      if (redirect.includes('?')) {
        res.redirect(redirect + `&error=userNotLinked`);
      } else {
        res.redirect(redirect + `?error=userNotLinked`);
      }

      return;
    }

    if (redirect.includes('?')) {
      res.redirect(redirect + `&code=${id}&action=${action}`);
    } else {
      res.redirect(redirect + `?code=${id}&action=${action}`);
    }

    } catch(e) {
      console.log(e)
    }
    return;
  }

  res.sendStatus(400); 
});

app.get('/api/instagram/oauth', async (req, res) => {
  const { code, state } = req.query;

  const { shop, customerId } = state ? JSON.parse(state) : {
    shop: undefined,
    customerId: undefined
  };

  if (code) {
    const { client_id, client_secret } = metaKeys.instagram;
    
    const formdata = new FormData();
    
    if (client_id && client_secret && typeof code === 'string') {
      formdata.append('client_id', client_id);
      formdata.append('client_secret', client_secret);
      formdata.append('grant_type', 'authorization_code');
      formdata.append('redirect_uri', `${process.env.HOST}/api/instagram/oauth`);
      formdata.append('code', code);
    }

    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: formdata
    }).then(res => res.json());

    
    const { user_id, access_token } = response;
    
    console.log(response);

    if (response.code === 400) {
      res.redirect(`${shop}/apps/product-builder`);
      return;
    }
    

    if (access_token && shop) {
      res.redirect(`${shop}/apps/product-builder?access_token=${access_token}&user_id=${user_id}`);
    } else if (access_token && !shop) {
      res.send({
        error: 'shop not provided' 
      });
    }

    return;
  }

  res.status(404).send({
    error: {
      message: 'Code or request body not provided'
    }
  });
});

app.use('/api/instagram/access_token', express.json(), async (req, res) => {
  res.send(req.body);
});

app.post('/api/facebookOAth', express.json(), async (req, res) => {
  const { authResponse, redirect, shop: shopName, action } = req.body;

  const shop = await Shop.findOne({ name: shopName });

  if (!shop) {
    res.send({
      error: 'No shop provided'
    });
    return;
  }

  if (!redirect) {
    res.send({
      error: 'No valid redirect URL'
    });
    return;
  }

  if (!action) {
    res.send({
      error: 'No action provided'
    });
    return;
  }

  try {
    const user = await fetch(`https://graph.facebook.com/v16.0/me?fields=id,first_name,email,last_name&access_token=${authResponse.accessToken}`)
      .then(res => res.json());


    const id = GetCode(150);

    if (!user.error) {
      const customers = await shopify.api.rest.Customer.search({
        session: shop?.session,
        query: `email:${user.email}`,
        fields: 'email, id'
      }).then(data => data.customers);

      if (!user.email) {
        res.send({
          error: 'Email has not provided'
        });
        return;
      }
        

      const isExists = await Customer.findOne({ email: user.email });

      
      const isFacebookLinked = isExists ? isExists.socials.some(social => social.name === 'facebook') : false;

      if (customers.length === 0 && !isExists && action === 'register') {
        const newCustomer = new Customer({
          authCode: id,
          email: user.email,
          name: user.first_name,
          lastName: user.last_name,
          socials: [{
            name: 'facebook',
            credentionals: authResponse
          }]
        });
  
        await newCustomer.save();
      } else if (customers.length > 0 && isExists && isFacebookLinked && action === 'login') {
        isExists.set('authCode', id);
        await isExists.save();
      } else if (isExists && action === 'register') {
        res.send({
          error: 'user Exists'
        });
        return;
      } else if (isExists && !isFacebookLinked && customers.length > 0 && action === 'login') {
        res.send({
          error: 'User exists, but not linked with Facebook'
        });
        return;
      }

      res.send({
        code: id,
        action: action
      });
      return;
    }
  } catch(e) {
    console.log(e);
  }

  res.status(400).send({
    error: 'Unknown error'
  });
});

app.post('/api/products/webhook/update', express.json(), webhookProductUpdate);
app.post('/api/products/webhook/delete', express.json(), webhookProductsDelete);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.get('/api/shop', async (req, res) => {
  const { session } = res.locals.shopify;

  const [shop] = await shopify.api.rest.Shop.all({ session });

  if (shop && shop.currency) {
    res.send({
      currency: shop.currency
    });
    return;
  }

  res.status(404).send({
    currency: 'RON'
  });
})

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
            },
            priceRangeV2 {
              minVariantPrice {
                amount
              }
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
      .filter(product => customProducts.every(cProd => cProd.shopify_id !== product.id))

    res.status(200).send(noRelatedProducts);
    return;
  }
    
  res.status(200).send(products);
});

app.get('/api/products', async (req, res) => { 
  const idToString = (idNumber) => `gid://shopify/Product/${idNumber}`;

  const { id } = req.query;

  const shop = await Shop.findOne({ name: res.locals.shopify.session.shop });

  const prods = await ProductModel.find({
    shop: shop?._id
  })

  if (id) {
    const shopify_id = typeof id === 'string' && parseInt(id).toString().length === id.length
      ? idToString(id)
      : id;

    const product = await ProductModel.findOne({
      shopify_id,
      shop: shop?._id
    });

    if (product) {
      res.status(200).send(product);
      return;
    }

    res.status(400).send({
      error: 'Invalid id => ' + id
    });
    return;
  }

  const products = await ProductModel.find({ shop: shop?._id}); 

  res.status(200).send(products);
});

app.get('/api/orders', async (req, res) => {
  const { id } = req.query;

  if (id) {
    const order = await Order.findOne({
      shopify_id: id
    });

    if (!order) {
      res.status(404).send({
        error: "Order doesn't exist"
      });
      return;
    }

    const hashedOrder = { 
      ...order.toObject(),
      line_items: order.line_items.map(item => {
        const orderProp = item.properties.find(prop => prop.name === 'project_id');

        if (!orderProp) {
          return;
        }

        const orderId = orderProp.value;

        
        const hashedProjectId = encryptPassword(orderId, process.env.PASSWORD_SECRET);
        
        return {
          ...item,
          hashedProjectId
        }
      }).filter(item => item)
    }; 
 
    res.send(hashedOrder); 
    return; 
  }

  const orders = await Order.find().sort({ order_number: 'desc' });

  const hashedOrders = orders.map(order => {
    const newLineItems = order.line_items.map(item => {
      const orderProp = item.properties.find(prop => prop.name === 'project_id');

      if (!orderProp) {
        return;
      }

      const orderId = orderProp.value;

      const hashedProjectId = encryptPassword(orderId, process.env.PASSWORD_SECRET);

      return {
        ...item,
        hashedProjectId
      }
    }).filter(item => item);
 

    return {
      ...order.toObject(),
      line_items: newLineItems
    }
  })

  res.send(hashedOrders);
}) 

app.post('/api/products', async (req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
    apiVersion: LATEST_API_VERSION
  });
  const { id, title, image, handle, options, priceRangeV2 } = req.body;

  const price = priceRangeV2.minVariantPrice.amount;

  const shop = await Shop.findOne({ name: res.locals.shopify.session.shop });

  const product = new ProductModel({
    shopify_id: id,
    shop: shop?._id,
    title,
    imageUrl: image?.url,
    handle, 
    status: 'active',
    options,
    quantity: {
      type: 'single'
    },
    price
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

  console.log(state.relatedProducts, );

  await ProductModel.findOneAndUpdate({ shopify_id: id }, {
    type: {
      id: currType?.id,
      title: currType?.title,
      variant: state?.variant
    },
    status: state.status,
    settings: state.settings,
    relatedProducts: state.relatedProducts,
    quantity: state.quantity,
    resolution: state.resolution
  });

  const product = await ProductModel.findOne({ shopify_id: id }); 

  res.status(200).send(product);
});


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