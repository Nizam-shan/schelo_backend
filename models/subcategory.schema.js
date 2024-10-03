import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    subcategory_name: { type: String, required: true, unique: true },

    status: { type: Boolean, default: true },

    category: {
      type: String,

      required: true,
    },
  },
  { timestamps: true }
);

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

export default SubCategory;
