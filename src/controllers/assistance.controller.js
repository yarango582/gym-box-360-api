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

    const affiliate = Affiliate.findOne({numeroDocumento: reqBody.numeroDocumento});

    if (!affiliate) {
        return res.status(400).json({
            success: false,
            error: 'This user is not an affiliate',
        });
    }

    const isAssistanceCreatedSameDay = await Assistance.find({ fechaDeAsistencia: reqBody.fechaDeAsistencia, idAfiliado: affiliate._id });

    if (isAssistanceCreatedSameDay.length) {
        return res.status(400).json({
            success: false,
            error: 'You can not create two assistances the same day',
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
            message: 'Assistance created!',
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            err,
            message: 'Assistance not created!',
        });
    }
};

const getAssistances = async (req, res) => {
    try {
        const assistances = await Assistance.find();
        if (!assistances.length) {
            return res.status(404).json({ success: false, error: `Assistances not found` });
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
            return res.status(404).json({ success: false, error: `Assistance not found` });
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