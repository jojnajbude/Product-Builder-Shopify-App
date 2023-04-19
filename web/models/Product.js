import { Schema } from "mongoose";
import mongoose from "./../database/index.js";

const ProductSchema = new mongoose.Schema({
  shopify_id: String,
  title: String,
  handle: String,
  imageUrl: String,
  status: String,
  options: [Schema.Types.Mixed],
  type: {
    id: String,
    title: String
  },
  settings: {
    hasLayout: Boolean,
    selectedLayouts: [String],
    hasText: Boolean,
    hasFrame: Boolean,
    hasCrop: Boolean,
    hasBackground: Boolean,
    hasRotate: Boolean,
    hasFilter: Boolean
  },
  relatedProducts: [Schema.Types.Mixed]
});

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;