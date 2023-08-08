import { Schema } from "mongoose";
import mongoose from "./../database/index.js";

const ProductSchema = new mongoose.Schema({
  shopify_id: String,
  shop: { type: Schema.Types.ObjectId, ref: 'Shop'},
  title: String,
  handle: String,
  imageUrl: String,
  status: String,
  options: [Schema.Types.Mixed],
  type: {
    id: String,
    title: String,
    variant: String
  },
  quantity: Schema.Types.Mixed,
  resolution: Schema.Types.Mixed,
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
  relatedProducts: [Schema.Types.Mixed],
  price: Number
});

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;