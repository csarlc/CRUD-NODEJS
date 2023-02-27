"use strict";

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../helpers/create-jwt");

//Create Read Update Delete

//funcion para crear un usuario por defecto
const adminApp = async (req, res) => {
  try {
    let user = new User();
    user.username = "Administrador";
    user.password = "123456";
    user.email = "cl232326@gmail.com";
    user.rol = "ADMIN";
    const userEncontrado = await User.findOne({ email: user.email });
    if (userEncontrado) return console.log("El administrador está listo");
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
    user = await user.save();
    if (!user) return console.log("El administrador no está listo!");
    return console.log("El administrador está listo!");
  } catch (err) {
    throw new Error(err);
  }
};

const createUser = async (req, res) => {
  //if (req.user.rol === "ADMIN") {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send({
        message: "Un usuario ya existe con este correo",
        ok: false,
        user: user,
      });
    }
    user = new User(req.body);

    //Encriptar la contraseña
    const saltos = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, saltos);

    //Guardar Usuarios
    user = await user.save();

    //generar token
    const token = await generateJWT(user.id, user.username, user.email);
    res.status(200).send({
      message: `Usuario ${user.username} creado correctamente`,
      user,
      token: token,
    });
  } catch (err) {
    throw new Error(err);
  }
  //} else {
  /*return res.status(500).send({
      message: "Este usuario no tiene permiso para crear mas usuarios",
    });*/
  //}
};

const readUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      res.status(404).send({ message: "No hay usuarios disponibles" });
    } else {
      res.status(200).json({ "usuarios encontrados": users });
    }
  } catch (err) {
    throw new Error(err);
  }
};

const updateUser = async (req, res) => {
  if (req.user.rol === "ADMIN") {
    try {
      const id = req.params.id;
      const userEdit = { ...req.body };
      //Encriptar Contraseña
      userEdit.password = userEdit.password
        ? bcrypt.hashSync(userEdit.password, bcrypt.genSaltSync())
        : userEdit.password;
      const userComplete = await User.findByIdAndUpdate(id, userEdit, {
        new: true,
      });
      if (userComplete) {
        const token = await generateJWT(
          userComplete.id,
          userComplete.username,
          userComplete.email
        );
        return res.status(200).send({
          message: "USuario actualizado correctamente",
          userComplete,
          token,
        });
      } else {
        res.status(404).send({
          message:
            "Este usuario no existe en la base de datos, verificar parametros",
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  } else {
    return res.status(200).send({
      message: "este usuario no tiene permisos para actualizar usuarios",
    });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.rol === "ADMIN") {
    try {
      const id = req.params.id;
      const userDelete = await User.findByIdAndDelete(id);
      return res
        .status(200)
        .send({ message: "usuario eliminado correctamente", userDelete });
    } catch (err) {
      throw new Error(err);
    }
  } else {
    return res
      .status(500)
      .send({ message: "este usuario no tiene permisos de ADMIn" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ ok: false, message: "El usuario no existe" });
    }
    const validPassword = bcrypt.compareSync(
      password /*el que nosotros enviamos*/,
      user.password /*password registrado en la base de datos*/
    );
    if (!validPassword) {
      return res
        .status(400)
        .send({ ok: false, message: "password incorrecto" });
    }

    const token = await generateJWT(user.id, user.username, user.email);
    res.json({
      ok: true,
      uid: user.id,
      name: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    throw new Error(err);
  }
};

const agregarMascota = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, edad, comida } = req.body;

    const userMascota = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          mascotas: {
            nombre: nombre,
            edad: edad,
            comida: comida,
          },
        },
      },
      { new: true }
    );
    if (!userMascota) {
      return res.status(404).send({ msg: "usuario no encontrado" });
    }

    return res.status(200).send({ userMascota });
  } catch (err) {
    throw new Error(err);
  }
};

const eliminarMascota = async (req, res) => {
  const id = req.params.id;
  const { idMascota } = req.body;
  try {
    const deleteMascota = await User.updateOne(
      { id },
      {
        $pull: { mascotas: { _id: idMascota } },
      },
      { new: true, multi: false }
    );

    if (!deleteMascota) {
      return res.status(404).send({ msg: "no existe este usuario" });
    }

    return res.status(200).send({ deleteMascota });
  } catch (err) {
    throw new Error(err);
  }
};

const editarMascota = async (req, res) => {
  const id = req.params.id;
  const { idMascota, nombre, edad, comida } = req.body;
  try {
    const updateMascota = await User.updateOne(
      { _id: id, "mascotas._id": idMascota },
      {
        $set: {
          "mascotas.$.nombre": nombre,
          "mascotas.$.edad": edad,
          "mascotas.$.comida": comida,
        },
      },
      { new: true }
    );

    if (!updateMascota) {
      return res.status(404).send({ msg: "no existe este usuario" });
    }

    return res
      .status(200)
      .send({ updateMascota, msg: "Mascota agregada correctamente" });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  adminApp,
  createUser,
  readUsers,
  updateUser,
  deleteUser,
  loginUser,
  agregarMascota,
  eliminarMascota,
  editarMascota,
};
