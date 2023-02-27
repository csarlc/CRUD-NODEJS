const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const User = require("../models/user.model");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token"); //este token lo envia en los headers

  //Si no viene el token
  if (!token) {
    return res.status(401).send({
      message: "No hay token en la peticion",
    });
  }

  try {
    //decodificar el token
    const payload = jwt.decode(token, process.env.SECRET_KEY);
    //usuario se va a buscar por medio del id que guarda el token
    const userEncontrado = await User.findById(payload.uId);
    console.log(userEncontrado);

    //verifica si el token no ha expirado
    if (payload.exp <= moment().unix()) {
      return res.status(500).send({ message: "el token ha expirado" });
    }
    //verifica si el usuario dueño del token sigue existiendo en la base de datos
    if (!userEncontrado) {
      return res.status(401).send({
        message: "Token no valido - user no existe en DB fisicamente",
      });
    }
    //creo un nuevo atributo en el request y se usa del lado del controller para validar si el rol tiene permisos(si es igual a admin)
    req.user = userEncontrado;

    //le dice al programa que continue con el siguiente middleware
    next();
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { validateJWT };
