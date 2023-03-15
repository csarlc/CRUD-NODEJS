"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ProductSchema = Schema({
  name: {
    type: String,
    required: String,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  descriptionId: {
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true,
  },
});

module.exports = mongoose.model("products", ProductSchema);
