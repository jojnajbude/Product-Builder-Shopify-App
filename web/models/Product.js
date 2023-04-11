import mongoose from "./../database/index.js";

const ProductSchema = new mongoose.Schema({
  shopify_id: String
});

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;