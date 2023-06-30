import { Schema } from "mongoose";
import mongoose from "./../database/index.js";

const ProjectSchema = new mongoose.Schema({
  orderID: String,
  status: String,
  createdAt: Number,
  updatedAt: Number,
  shop: String,
  logged: Boolean,
  customerID: String,
  quantity: Number,
  product: Schema.Types.Mixed
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project; 