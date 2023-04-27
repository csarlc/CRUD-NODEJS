"use strict";
const { Router } = require("express");
const {
  createCategory,
  listCategories,
} = require("../controllers/category.controller");

const api = Router();

api.post("/create-category", createCategory);
api.get("/list-categories", listCategories);

module.exports = api;
