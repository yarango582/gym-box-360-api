const Assistance = require('../models/assistance.model');
const Affiliate = require('../models/affiliates.model');
const AffiliateSuscription = require('../models/affiliatesSuscription.model');

const createAssistance = async (req, res) => {
    try {
        const reqBody = req.body;

        if (!reqBody) {
            return res.status(400).json({
                success: false,
                error: 'You must provide an assistance',
            });
        }

        // valida si el usuario existe
        const affiliate = await Affiliate.findOne({
            numeroDocumento: reqBody.numeroDocumento,
        });

        // valida si el usuario es un afiliado
        if (!affiliate) {
            return res.status(400).json({
                success: false,
                message: 'El usuario no es un afiliado',
            });
        }

        // valida si ya existe una asistencia registrada el mismo dia
        const isAssistanceCreatedSameDay = await Assistance.find({
            numeroDocumento: reqBody.numeroDocumento,
            fechaDeAsistencia: {
                $gte: new Date(reqBody.fechaDeAsistencia).setHours(0, 0, 0),
                $lt: new Date(reqBody.fechaDeAsistencia).setHours(23, 59, 59),
            },
        });

        // valida si existe una suscripcion
        const isActiveSuscription = await AffiliateSuscription.findOne({
            idAfiliado: affiliate._id,
        });

        // valida si tiene dias de cortesia y si la suscripcion esta activa
        if (affiliate.diasDeCortesia === 0 && !isActiveSuscription || isActiveSuscription?.activo === false) {
            return res.status(400).json({
                success: false,
                message: 'El afiliado no tiene una suscripcion activa',
            });
        }

        // actualiza los dias de cortesia
        await Affiliate.updateOne({
            numeroDocumento: reqBody.numeroDocumento,
        }, {
            diasDeCortesia: affiliate.diasDeCortesia - 1,
        });

        // valida si ya existe una asistencia registrada el mismo dia
        if (isAssistanceCreatedSameDay.length) {
            return res.status(400).json({
                success: false,
                message: 'No es necesario registrar la asistencia, ya se encuentra registrada',
            });
        }

        // crea la asistencia
        const assistance = new Assistance(reqBody);

        // valida si la asistencia se creo correctamente
        if (!assistance) {
            return res.status(400).json({ success: false, error: err });
        }

        // guarda la asistencia
        await assistance.save();

        // retorna la asistencia creada
        return res.status(201).json({
            success: true,
            id: assistance._id,
            message: 'Asistencia registrada!',
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            err,
            message: 'Asistencia no creada, intenta mas tarde',
        });
    }
};

const getAssistances = async (req, res) => {
    try {
        const assistances = await Assistance.find();
        if (!assistances.length) {
            return res.status(404).json({ success: false, error: `Asistencias no encontradas` });
        }
        return res.status(200).json({ success: true, data: assistances });
    } catch (err) {
        return res.status(400).json({ success: false, error: err });
    }
};

const getAssistanceById = async (req, res) => {
    try {
        const assistance = await Assistance.findById(req.params.id);
        if (!assistance) {
            return res.status(404).json({ success: false, error: `Asistencias no encontradas` });
        }
        return res.status(200).json({ success: true, data: assistance });
    } catch (err) {
        return res.status(400).json({ success: false, error: err });
    }
};

module.exports = {
    createAssistance,
    getAssistances,
    getAssistanceById
};