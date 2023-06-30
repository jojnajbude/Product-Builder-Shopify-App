import mongoose from "mongoose";
import { config } from "dotenv";
config();

mongoose.connect(process.env.DATABASE_URL);
export default mongoose;
 