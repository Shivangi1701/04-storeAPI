// to automatically add products to our database by invoking populate.js
require("dotenv").config();

// as we are connecting to database one more time
// we need to require connectDB here as well
const connectDB = require("./db/connect");
const Product = require("./models/product"); //grab the schema

const jsonProducts = require("./products.json");

//just to connect to the database & use model to add json products to it
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); //wait till connection establishes
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log("Success!!!!!");
    process.exit(0); // to exit the process
  } catch (error) {
    console.log(error);
    process.exit(1); // to exit the process
  }
};

start();
