"use strict";

const express = require("express");
const { adminApp } = require("./src/controllers/user.controller");
const app = express();
const { connection } = require("./src/database/connection");
require("dotenv").config();
const port = process.env.PORT;
const routes = require("./src/routes/user.routes");
const routesCategory = require("./src/routes/category.routes");
const cors = require("cors");

adminApp();
connection();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cors());
app.use("/api", [routes, routesCategory]);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
