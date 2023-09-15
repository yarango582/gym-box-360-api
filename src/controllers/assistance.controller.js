const Assistance = require('../models/assistance.model');
const Affiliate = require('../models/affiliates.model');

const createAssistance = async (req, res) => {
    const reqBody = req.body;

    if (!reqBody) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an assistance',
        });
    }

    const affiliate = await Affiliate.findOne({
        numeroDocumento: reqBody.numeroDocumento,
    });

    if (!affiliate) {
        return res.status(400).json({
            success: false,
            message: 'El usuario no es un afiliado',
        });
    }

    const isAssistanceCreatedSameDay = await Assistance.find({
        numeroDocumento: reqBody.numeroDocumento,
        fechaDeAsistencia: {
            $gte: new Date(reqBody.fechaDeAsistencia).setHours(0, 0, 0),
            $lt: new Date(reqBody.fechaDeAsistencia).setHours(23, 59, 59),
        },
    });


    if (isAssistanceCreatedSameDay.length) {
        return res.status(400).json({
            success: false,
            message: 'No es necesario registrar la asistencia, ya se encuentra registrada',
        });
    }

    const assistance = new Assistance(reqBody);

    if (!assistance) {
        return res.status(400).json({ success: false, error: err });
    }

    try {
        await assistance.save();

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