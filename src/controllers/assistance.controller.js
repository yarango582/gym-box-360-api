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
            activo: true,
        });

        // valida si tiene dias de cortesia y si la suscripcion esta activa
        if (affiliate.diasDeCortesia === 0 && !isActiveSuscription || isActiveSuscription?.activo === false) {
            return res.status(400).json({
                success: false,
                message: 'El afiliado no tiene una suscripcion activa',
            });
        }

        // actualiza los dias de cortesia del afiliado si los dias de cortesia ya se acabaron no se actualiza

        if (affiliate.diasDeCortesia > 0) {
            await Affiliate.updateOne(
                { _id: affiliate._id },
                { diasDeCortesia: affiliate.diasDeCortesia - 1 }
            );
        }

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
        return res.status(200).json({ success: true, message: 'ok', data: assistances });
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

const getAssistancesTodayWithAffiliate = async (req, res) => {

    try {
        const assistances = await Assistance.find({
            fechaDeAsistencia: {
                $gte: new Date().setHours(0, 0, 0),
                $lt: new Date().setHours(23, 59, 59),
            },
        });

        if (!assistances.length) {
            return res.status(404).json({ success: false, error: `Asistencias no encontradas` });
        }

        const assistancesWithAffiliate = await Promise.all(assistances.map(async (assistance) => {
            const affiliate = await Affiliate.findOne({
                numeroDocumento: assistance.numeroDocumento,
            });
            // deuelve la asistencia con el afiliado y suscripcion

            const suscription = await AffiliateSuscription.findOne({
                idAfiliado: affiliate._id,
            });

            return {
                ...assistance._doc,
                affiliate: affiliate._doc,
                suscription: suscription._doc,
            };

        }));

        return res.status(200).json({ success: true, message: 'ok', data: assistancesWithAffiliate });
    } catch (err) {
        return res.status(400).json({ success: false, error: err });
    }
};

const getNonAttendanceWithAffiliateAndSuscription = async (req, res) => {
    try {
        const affiliatesWithSuscriptions = await AffiliateSuscription.find().populate('idAfiliado');

        const results = await Promise.allSettled(
            affiliatesWithSuscriptions.map(async (affiliateSuscription) => {
                const numeroDocumento = affiliateSuscription?.idAfiliado?.numeroDocumento;
                if (numeroDocumento) {
                    try {
                        const assistance = await Assistance.findOne({
                            numeroDocumento,
                            fechaDeAsistencia: {
                                $gte: new Date().setHours(0, 0, 0),
                                $lt: new Date().setHours(23, 59, 59),
                            },
                        });
                        if (!assistance) {
                            return { status: 'fulfilled', value: affiliateSuscription };
                        }
                    } catch (error) {
                        return { status: 'rejected', reason: String(error) };
                    }
                }
            })
        );

        const affiliatesFulfilled = results.map((result) => {
            if(result.status === 'fulfilled') {
                return {
                    affiliate: result.value,
                }
            }
        });
        return res.status(200).json({ success: true, message: 'ok', data: affiliatesFulfilled });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Hubo un error al obtener los datos!', error });
    }
};


module.exports = {
    createAssistance,
    getAssistances,
    getAssistanceById,
    getAssistancesTodayWithAffiliate,
    getNonAttendanceWithAffiliateAndSuscription,
};