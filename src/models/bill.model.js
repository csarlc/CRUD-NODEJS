"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const BillSchema = Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "clients",
    required: true,
  },
  date: Date,
  nit: {
    type: String,
    required: false,
  },
  products: {
    type: [
      {
        id: { type: Schema.Types.ObjectId, ref: "products" },
        price: { type: Number, required: true },
        nameProduct: { type: String, required: true },
      },
    ],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("bills", BillSchema);
