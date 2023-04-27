import { Schema } from "mongoose";

import mongoose from "./../database/index.js";

const ShopSchema = new mongoose.Schema({
  name: String,
  session: Schema.Types.Mixed,
});

const Shop = mongoose.model('Shop', ShopSchema);

export default Shop;