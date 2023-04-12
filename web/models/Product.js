import mongoose from "./../database/index.js";

const ProductSchema = new mongoose.Schema({
  shopify_id: String,
  title: String,
  handle: String,
  imageUrl: String,
});

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;