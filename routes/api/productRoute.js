const express = require("express");
const productRoute = express.Router();

const adminProtectMiddleware = require("../../middlewares/adminProtectMiddleware");
const productController = require("../../controllers/productController");
const {
  validateProductKeys,
} = require("../../middlewares/validateKeyNamesMiddleware");

//-- GET ALL PRODUCTS
productRoute.get(
  "/",
  [
    productController.getCategoryProductsMiddleware,
    productController.getSearchedProductMiddleware,
  ],
  productController.getAllProducts
);

//-- GET PRODUCT
productRoute.get("/:id", productController.getProduct);

//-- //-- USE Adding the ADMIN MIDDLEWARE to all the below
productRoute.use(adminProtectMiddleware);

//-- CREATE (ADMIN) A NEW PRODUCT
productRoute.post("/", [validateProductKeys], productController.createProduct);

//-- UPDATE (ADMIN) A PRODUCT
productRoute.put(
  "/:id",
  [validateProductKeys],
  productController.updateProduct
);

//-- DELETE (ADMIN) A PRODUCT
productRoute.delete("/:id", productController.deleteProduct);

module.exports = productRoute;
