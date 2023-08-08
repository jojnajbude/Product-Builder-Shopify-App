import ProductModel from "../models/Product.js";
import Shop from "../models/Shop.js";
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import shopify from "../shopify.js";

export const webhookRegister = async (req, res, next) => {
  const host = process.env.HOST;

  const webhookToCreate = new shopify.api.rest.Webhook({
    session: res.locals.shopify.session
  }); 

  webhookToCreate.address = `${host}/api/customers/create`;
  webhookToCreate.topic = "customers/create";
  webhookToCreate.format = "json";
  await webhookToCreate.save({ 
    update: true,
  });

  const webhookToDelete = new shopify.api.rest.Webhook({
    session: res.locals.shopify.session
  });

  webhookToDelete.address = `${host}/api/customers/delete`;
  webhookToDelete.topic = "customers/delete";
  webhookToDelete.format = "json";
  await webhookToDelete.save({
    update: true,
  });

  const webhookShopifyOrder = new shopify.api.rest.Webhook({
    session: res.locals.shopify.session 
  });

  webhookShopifyOrder.address = `${host}/product-builder/orders/shopify/order/create`;
  webhookShopifyOrder.topic = "orders/create";
  webhookShopifyOrder.format = "json";
  await webhookShopifyOrder.save({
    update: true,
  });

  const webhookProductsUpdate = new shopify.api.rest.Webhook({
    session: res.locals.shopify.session 
  });

  webhookProductsUpdate.address = `${host}/api/products/webhook/update`;
  webhookProductsUpdate.topic = "products/update";
  webhookProductsUpdate.format = "json";
  await webhookProductsUpdate.save({
    update: true,
  });

  const webhookProductsDelete = new shopify.api.rest.Webhook({
    session: res.locals.shopify.session 
  });

  webhookProductsDelete.address = `${host}/api/products/webhook/delete`;
  webhookProductsDelete.topic = "products/delete";
  webhookProductsDelete.format = "json";
  await webhookProductsDelete.save({
    update: true,
  });

  next();
};

export const shopRegister = async (req, res, next) => {
  const shop = new Shop({
    session: res.locals.shopify.session,
    name: res.locals.shopify.session.shop
  });

  const shopExists = await Shop.findOne({ name: res.locals.shopify.session.shop });

  if (!shopExists) {
    await shop.save();
  } else {
    shopExists.set('session', res.locals.shopify.session).save();
  }

  next();
};

export const webhookProductUpdate = async (req, res) => {
  const product = req.body;

  if (!product) {
    res.status(400).send({
      error: {
        message: 'no product'
      }
    });
    return;
  }

  const builderId = `gid://shopify/Product/${product.id}`;

  console.log(builderId, product.title);

  const builderProduct = await ProductModel.findOne({ shopify_id: builderId });

  if (!builderProduct) {
    res.sendStatus(400);
    return;
  }

  const shop = await Shop.findById(builderProduct.shop);

  if (!builderProduct || !shop) {
    res.sendStatus(200);
    return;
  }

  const client = new shopify.api.clients.Graphql({
    session: shop.session,
    apiVersion: LATEST_API_VERSION
  });

  if (product.image) {
    builderProduct.set('imageUrl', product.image.src);
  }

  builderProduct.set('title', product.title);
  builderProduct.set('handle', product.handle);

  builderProduct.set('options', product.options);

  const minPrice = Math.min(...product.variants.map(variant => parseFloat(variant.price)));

  if (typeof minPrice === 'number' && !isNaN(minPrice) && isFinite(minPrice)) {
    builderProduct.set('price', minPrice);
  }

  builderProduct.save();

  const graphProduct = await client.query({
    data: `
      query {
        product (id: "${builderId}") {
          metafield(key: "builder_id", namespace: "custom") {
            id
            value
          }
        }
      }
    `
  });

  if (!graphProduct.body || !graphProduct.body.data) {
    res.sendStatus(400);
    return;
  }

  const metafield = graphProduct.body.data.product.metafield;
  

  if (!metafield) {
    await client.query({
      data: `
      mutation {
        metafieldsSet(metafields: {
          ownerId: "${builderId}",
          namespace: "custom",
          key: "builder_id",
          value: "${builderProduct._id.valueOf()}",
        }) {
          metafields {
            id
            key
            namespace
          }
        }
      }`
    });
  }

  res.sendStatus(200);
};

export const webhookProductsDelete = async (req, res) => {
  const product = req.body;

  console.log(product);

  if (!product) {
    res.sendStatus(400);
    return;
  }

  const builderId = `gid://shopify/Product/${product.id}`;

  const builderProduct = await ProductModel.deleteOne({ shopify_id: builderId });

  if (builderProduct) {
    console.log(builderProduct);
  }

  res.sendStatus(200);
}