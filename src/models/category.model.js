"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CategorySchema = Schema({
  name: { type: String, required: true },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("categories", CategorySchema);
