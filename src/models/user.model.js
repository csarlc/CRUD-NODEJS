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
});

module.exports = mongoose.model("users", UserSchema);
