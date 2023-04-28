import { Schema } from "mongoose";

import mongoose from "./../database/index.js";

const CustomerSchema = new mongoose.Schema({
  name: String,
  authCode: String,
  shopify_id: String,
  lastName: String,
  email: String,
  password: String,
  shop: String,
  socials: [Schema.Types.Mixed]
});

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;