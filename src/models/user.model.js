"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  email: String,
  password: String,
  rol: String,
  mascotas: [{
    nombre: String,
    edad: Number,
    comida: String
  }]
});

module.exports = mongoose.model("users", UserSchema);
