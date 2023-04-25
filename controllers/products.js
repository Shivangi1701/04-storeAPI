// controls the route functionality
const { query } = require("express");
const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const search = "ab";
  const products = await Product.find({ price: { $lt: 30 } })
    .sort("name")
    .select("name price");
  //.limit(10)
  //.skip(2);
  res.status(200).json({ products, nbHits: products.length });
};

// takes the query and return products with that query
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query; //destructuring the query params
  const queryObject = {};

  if (featured) {
    //if featured property exist
    queryObject.featured = featured === "true" ? true : false;
    // if featured === 'true' then true otherwise false
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$e",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|=|<=|>=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-"); //split it on -
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObject);

  let result = Product.find(queryObject); //queryObject = {} i.e, find({}) - returns all products

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList); // if provided with sorting criteria
  } else {
    result = result.sort("createdAt"); // if not provided .. sort on the basis of creation date
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1; // page = '2' is a string OR if page is not passed then equal to 1
  const limit = Number(req.query.limit) || 10;
  //logic
  const skip = (page - 1) * limit; // 1st page so no skip (show first 10 start elements) 1 page - 10
  //2nd page so skip first 10 (page2 : 11 - 20 elements) & (page3  : 21-23)
  result = result.skip(skip).limit(limit);

  const products = await result; // final product list after sorting
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
}; // used in routes/product.js
