import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  AddCategory,
  AddProducts,
  AddSubCategory,
  getAllCategory,
  getAllProduct,
  getAllSubCategory,
  updateCategory,
  UpdateProduct,
  UpdateSubCategory,
} from "../controllers/crudController.js";

const router = Router();

router.post("/add_category", AddCategory);
router.put("/update_category/:categoryId", updateCategory);

router.post("/add_sub_category", AddSubCategory);

router.put("/update_subcategory/:subcategoryId", UpdateSubCategory);

router.get("/all_category", getAllCategory);

router.get("/all_sub_category", getAllSubCategory);

router.post("/add_product", upload.array("product_image", 5), AddProducts);
router.put(
  "/update_products/:productId",
  upload.array("product_image", 5),
  UpdateProduct
);

router.get("/all_products", getAllProduct);

export default router;
