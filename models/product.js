// for schema
const mongoose = require("mongoose"); //ODM - object document mapper - database to javascript

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "product price must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported", // if any other value is provided - validation error
    },
    // enum:['ikea', 'liddy', 'caressa', 'marcos'], //only from these given companies
  },
});

module.exports = mongoose.model("Product", productSchema);
