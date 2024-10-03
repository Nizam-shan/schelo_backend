import Joi from "joi";
import { sendResponse } from "../helpers/Response.js";

import Category from "../models/category.schema.js";
import SubCategory from "../models/subcategory.schema.js";
import Product from "../models/product.schema.js";

const categoryJoiValidation = Joi.object({
  category_name: Joi.string().required(),
});

export const AddCategory = async (req, res) => {
  try {
    const { error } = categoryJoiValidation.validate(req.body);
    if (error) {
      return sendResponse(res, 400, null, error?.details[0]?.message);
    }

    const { category_name } = req.body;
    const categoryExists = await Category.findOne({ category_name });
    if (categoryExists) {
      return sendResponse(res, 400, null, "Category already exists");
    }
    const newCategory = new Category({
      category_name,
    });
    await newCategory.save();
    return sendResponse(res, 201, newCategory, "Category added successfully");
  } catch (error) {
    console.log("🚀 ~ AddCategory ~ error:", error);
    return sendResponse(res, 500, null, error.message);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { category_name, status } = req.body;

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return sendResponse(res, 404, null, "Category not found");
    }

    // Update category
    existingCategory.category_name =
      category_name || existingCategory.category_name;

    existingCategory.status =
      typeof status !== undefined ? status : existingCategory.status;

    await existingCategory.save();
    return sendResponse(
      res,
      200,
      existingCategory,
      "Category updated successfully"
    );
  } catch (error) {
    console.log("🚀 ~ updateCategory ~ error:", error);
    return sendResponse(res, 500, null, error.message);
  }
};

export const AddSubCategory = async (req, res) => {
  try {
    const { category, subcategory_name } = req.body;
    const categoryExist = await Category.findOne({ category_name: category });
    if (!categoryExist) {
      return sendResponse(res, 404, null, "Category not found");
    }

    const subcategoryExist = await SubCategory.findOne({ subcategory_name });
    if (subcategoryExist) {
      return sendResponse(res, 400, null, "SubCategory already exists");
    }

    const newsubcategory = new SubCategory({
      subcategory_name,

      category: category,
    });
    newsubcategory.save();
    return sendResponse(
      res,
      201,
      newsubcategory,
      "Sub Category added successfully"
    );
  } catch (error) {
    return sendResponse(res, 500, null, error.message);
  }
};

export const UpdateSubCategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const {
      subcategory_name,

      category,
      status,
    } = req.body;
    const exist = await SubCategory.findById(subcategoryId);
    if (!exist) {
      return sendResponse(res, 404, null, "SubCategory not found");
    }

    exist.subcategory_name = subcategory_name || exist.subcategory_name;
    exist.category = category || exist.category;

    exist.status = typeof status !== undefined ? status : exist.status;
    await exist.save();
    return sendResponse(res, 200, exist, "sub Category updated successfully");
  } catch (error) {
    console.log("🚀 ~ updateCategory ~ error:", error);
    return sendResponse(res, 500, null, error.message);
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categoryList = await Category.find({}).sort({ createdAt: -1 });
    return sendResponse(
      res,
      200,
      categoryList,
      "Fetched all category Successfully"
    );
  } catch (error) {
    return sendResponse(res, 500, null, error.message);
  }
};

export const getAllSubCategory = async (req, res) => {
  try {
    const subcategoryList = await SubCategory.find({}).sort({ createdAt: -1 });
    return sendResponse(
      res,
      200,
      subcategoryList,
      "Fetched all Sub Category Successfully"
    );
  } catch (error) {
    return sendResponse(res, 500, null, error.message);
  }
};
// products

export const AddProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory_name,
      product_name,
      product_image,
      variant,
      description,
    } = req.body;
    const categoryExist = await Category.findOne({
      category_name: category,
    });
    if (!categoryExist) {
      return sendResponse(res, 404, null, "Category not found");
    }

    const subcategoryExist = await SubCategory.findOne({
      subcategory_name: subcategory_name,
    });
    if (!subcategoryExist) {
      return sendResponse(res, 404, null, "Sub Category not found");
    }

    const productExist = await Product.findOne({ product_name: product_name });
    if (productExist) {
      return sendResponse(res, 400, null, "Product already exists");
    }
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const variants =
      typeof variant === "string" ? JSON.parse(variant) : variant;

    const newProduct = new Product({
      subcategory_name,
      product_name,
      product_image: images,
      category,
      variant: variants || [],
      description,
    });
    newProduct.save();
    return sendResponse(res, 201, newProduct, "Product added successfully");
  } catch (error) {
    return sendResponse(res, 500, null, error.message);
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      subcategory_name,
      product_name,
      product_image,
      category,
      variant,
      description,
      status,
    } = req.body;
    const exist = await Product.findById(productId);
    if (!exist) {
      return sendResponse(res, 404, null, "Product not found");
    }
    let images = exist.product_image;
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }
    const variants =
      typeof variant === "string" ? JSON.parse(variant) : variant;
    exist.subcategory_name = subcategory_name || exist.subcategory_name;
    exist.category = category || exist.category;
    exist.variant = variants || exist.variant;
    exist.product_name = product_name || exist.product_name;
    exist.description = description || exist.description;

    exist.product_image = images;
    exist.status = typeof status !== undefined ? status : exist.status;
    await exist.save();
    return sendResponse(res, 200, exist, "Product updated successfully");
  } catch (error) {
    console.log("🚀 ~ updateCategory ~ error:", error);
    return sendResponse(res, 500, null, error.message);
  }
};
export const getAllProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sub_category } = req.query;

    let query = {};
    if (search) {
      query.product_name = { $regex: search, $options: "i" };
    }
    if (sub_category) {
      query.subcategory_name = sub_category;
    }

    const productList = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await Product.countDocuments(query);

    return sendResponse(
      res,
      200,
      {
        products: productList,
        totalpages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        totalCount,
      },
      "Fetched all products Successfully"
    );
  } catch (error) {
    return sendResponse(res, 500, null, error.message);
  }
};

export const getAllProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const list = await Product.findById({ _id: productId });

    return sendResponse(res, 200, list, "Fetched products Successfully");
  } catch (error) {
    console.log("🚀 ~ getAllCategoryById ~ error:", error);
    return sendResponse(res, 500, null, error.message);
  }
};
