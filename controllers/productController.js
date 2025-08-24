const productModel = require("../models/ProductModel");

const productController = {};

//-- GET ALL PRODUCTS UNDER CATEGORY
productController.getCategoryProductsMiddleware = function (req, res, next) {
  if (req?.query && Object.values(req.query).length > 0) {
    if (req.query["cat"]) {
      const products = productModel.getUnderCategory(req.query.cat);
      if (!products)
        return res
          .status(204)
          .json({ success: false, message: "Category doesn't exist " });
      else return res.status(200).json({ success: true, data: products });
    }
  }
  next();
};
//-- GET ALL SEARCHED PRODUCTS
productController.getSearchedProductMiddleware = function (req, res, next) {
  if (req?.query && Object.values(req.query).length > 0) {
    if (req.query?.["search"]) {
      const products = productModel.getSearchedProducts(req.query.search);
      if (!products)
        return res
          .status(204)
          .json({ success: false, message: "Category doesn't exist " });
      else return res.status(200).json({ success: true, data: products });
    }
  }
  next();
};

//-- GET ALL PRODUCTS
productController.getAllProducts = function (req, res) {
  const products = productModel.get();
  if (!products)
    return res
      .status(500)
      .json({ success: false, message: "Problem getting the products" });

  res.status(200).json({ success: true, data: products });
};

//-- GET PRODUCT
productController.getProduct = function (req, res) {
  const { id } = req.params;

  const product = productModel.getById(id);
  if (!product)
    return res.status(404).json({
      success: false,
      messge: `Can not find the product with the ID : ${id}`,
    });

  res.status(200).json({ success: true, data: product });
};

//-- CREATE (ADMIN) A NEW PRODUCT
productController.createProduct = async function (req, res) {
  let catErrorSetted = false;
  const missingProductPropertyError = productModel.keySchema
    .map((key) => {
      if (key === "imageURL" || key === "id" || key === "description") return;
      if (!catErrorSetted && !req.body?.category) {
        catErrorSetted = true;
        return `🔺category is required`;
      }
      if (!req.body?.[key]) {
        return `🔺${key.toUpperCase()}  is required`;
      }

      return;
    })
    .filter((str) => str);
  catErrorSetted = false;
  // check for any missing property
  if (missingProductPropertyError.length > 0) {
    const message =
      missingProductPropertyError.length === productModel.keySchema.length
        ? "Data was not specified"
        : missingProductPropertyError.join("  ");

    return res.status(400).json({
      success: false,
      message,
    });
  }

  const { category, ...newProduct } = req.body;

  if (productModel.duplicteExist(newProduct.name, category))
    return res.status(409).json({
      success: false,
      message: `Product Under ${category} with the name of (${newProduct.name}) Already exist`,
    });

  await productModel.create(newProduct, category);
  res.status(201).json({ success: true });
};

//-- UPDATE (ADMIN) A PRODUCT
productController.updateProduct = async function (req, res) {
  const { id } = req.params;

  if (req.body?.id)
    return res
      .status(409)
      .json({ success: false, message: "ID can not be updated (read only)" });

  if (!productModel.getById(id)?.name)
    return res.status(404).json({
      success: false,
      message: `Product with id of ${id} does not exist `,
    });

  await productModel.updateById(id, req.body);
  res.status(200).json({ success: true });
};

//-- DELETE (ADMIN) A PRODUCT
productController.deleteProduct = async function (req, res) {
  const { id } = req.params;
  if (!productModel.getById(id)?.name)
    return res.status(404).json({
      success: false,
      message: `Product with id of ${id} does not exist `,
    });

  await productModel.deleteById(id);
  res.status(200).json({ success: true });
};

module.exports = productController;
