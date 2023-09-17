const UserModel = require('../models/users.model');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ numeroDocumento: req.body.numeroDocumento });

        if(!user) {
            return res.status(400).json({ success: false, message: "Usuario no encontrado!" });
        }

        const isPasswordValid = await bcrypt.compare(req.body.contrasena, user.contrasena);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Usuario o contraseña incorrectos" });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario logueado correctamente",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const register = async (req, res) => {
    try {
        const passwordCrypted = await bcrypt.hash(req.body.contrasena, 10);
        const user = await UserModel.create({ contrasena: passwordCrypted, ...req.body });

        if (!user) {
            res.status(400).json({ success: false, message: "No se pudo crear el usuario" });
        }

        res.status(201).json({
            success: true,
            message: "Usuario creado correctamente",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
};

module.exports = {
    login,
    register,
};