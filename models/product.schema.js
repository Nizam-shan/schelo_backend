import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    subcategory_name: { type: String, required: true },
    product_name: { type: String, required: true },
    status: { type: Boolean, default: true },
    product_image: { type: [String], required: true, default: [] },
    description: { type: String },
    variant: [
      {
        Ram: { type: String },
        Price: { type: Number },
        Qty: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
