import { Schema } from "mongoose";
import mongoose from "./../database/index.js";

const OrderSchema = new mongoose.Schema({
  shopify_id: String,
  checkout_id: String,
  contact_email: String,
  email: String,
  current_subtotal_price: String,
  currency: String,
  name: String,
  order_number: Number,
  number: Number,
  order_status_url: String,
  customer: Schema.Types.Mixed,
  line_items: [Schema.Types.Mixed]
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;