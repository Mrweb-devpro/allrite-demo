const path = require("path");
const fsPromises = require("fs").promises;
const data = {};
data.allProducts = require("../data/products.json");

const productModel = {};

//-- GET ALL products
productModel.get = () => {
  return data.allProducts;
};

//-- products Schema
productModel.keySchema = Object.keys(data.allProducts[0].clothing[0]);

//-- GET By id
productModel.getById = (id) => {
  return data.allProducts
    .map((cat) => Object.values(cat))
    .flat(2)
    .find((product) => String(product.id) === String(id));
};

//-- GET all product under a category
productModel.getUnderCategory = (category) => {
  return data.allProducts[0][category];
};

//-- GET  the Searched Product
productModel.getSearchedProducts = (search) => {
  const result = Object.values(data.allProducts[0])
    .flat(1)
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  const dataObj = {};
  dataObj[`Searched Result: (${result.length})`] = result;
  console.log(dataObj);
  return [dataObj];
};

//-- CREATE a product (ADMIN)
productModel.create = async (product, cat) => {
  const newProduct = {
    description: "Get now",
    imageURL: "",
    id: crypto.randomUUID().replaceAll("-", ""),
    ...product,
  };

  data.allProducts[0][cat] = [...(data.allProducts[0][cat] || []), newProduct];

  const updatedProducts = JSON.stringify(data.allProducts);

  return await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "products.json"),
    updatedProducts
  );
};

//-- UPDATE a product (ADMIN)
productModel.updateById = async (id, newProductData) => {
  const cat = data.allProducts
    .map((obj) => {
      const cat = Object.entries(obj).map(([catg, productArr]) =>
        productArr?.find((product) => String(product.id) === String(id))?.id
          ? catg
          : ""
      );
      return cat;
    })
    .flat(1)
    .filter((str) => str)[0];
  const updatedProduct = {
    ...data.allProducts[0][cat].find((product) => String(product.id) === id),
    ...newProductData,
  };

  data.allProducts[0][cat] = [
    ...data.allProducts[0][cat].filter((product) => String(product.id) !== id),
    updatedProduct,
  ];

  return await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "products.json"),
    JSON.stringify(data.allProducts)
  );
};

//-- DELETE a product (ADMIN)
productModel.deleteById = async (id) => {
  const cat = data.allProducts
    .map((obj) => {
      const cat = Object.entries(obj).map(([catg, productArr]) =>
        productArr?.find((product) => String(product.id) === String(id))?.id
          ? catg
          : ""
      );
      return cat;
    })
    .flat(1)
    .filter((str) => str)[0];
  console.log(cat);

  data.allProducts[0][cat] = [
    ...data.allProducts[0][cat].filter((product) => String(product.id) !== id),
  ];
  return await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "products.json"),
    JSON.stringify(data.allProducts)
  );
};

//-- CHECK (by name and the category it is under) if the product product already exist
productModel.duplicteExist = (name, cat) => {
  const isDuplicate =
    data.allProducts[0][cat]?.findIndex((product) => product.name === name) >=
    0;

  return isDuplicate;
};

module.exports = productModel;
