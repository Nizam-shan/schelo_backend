import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    category_name: { type: String, required: true, unique: true },

    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

export default Category;
