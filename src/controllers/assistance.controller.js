const Assistance = require('../models/assistance.model');
const Affiliate = require('../models/affiliates.model');
const AffiliateSuscription = require('../models/affiliatesSuscription.model');
const moment = require('moment');

const today = moment(new Date()).utcOffset('-05:00').format('YYYY-MM-DD:HH:mm:ss');

const createAssistance = async (req, res) => {
    try {

        const { numeroDocumento } = req.body;
        const affiliate = await Affiliate.findOne({ numeroDocumento });
        if (!affiliate) {
            return res.status(404).json({ success: false, message: `Afiliado no encontrado` });
        }
        const suscription = await AffiliateSuscription.findOne({ idAfiliado: affiliate._id, activo: true });
        if (!suscription) {
            return res.status(404).json({ success: false, message: `No hay una suscripcion activa para el afiliado` });
        }

        const newAssistances = new Assistance({
            ...req.body,
            fechaDeAsistencia: today,
        });

        await newAssistances.save();

        return res.status(201).json({ success: true, message: 'Asistencia registrada correctamente' });

    } catch (error) {
        return res.status(400).json({ success: false, message: error });
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
        // obtenen ano mes y dia de hoy para filtrar las asistencias con formato y zona horaria de colombia
        const year = moment(new Date()).utcOffset('-05:00').format('YYYY');
        const month = moment(new Date()).utcOffset('-05:00').format('MM');
        const day = Number(moment(new Date()).utcOffset('-05:00').format('DD'));

        const assistances = await Assistance.find();
        if (!assistances.length) {
            return res.status(404).json({ success: false, error: `Asistencias no encontradas` });
        }

        const assistancesToday = assistances.filter((assistance) => {
            const assistanceYear = moment(assistance.fechaDeAsistencia).utcOffset('-05:00').format('YYYY');
            const assistanceMonth = moment(assistance.fechaDeAsistencia).utcOffset('-05:00').format('MM');
            const assistanceDay = Number(moment(assistance.fechaDeAsistencia).utcOffset('-05:00').format('DD'));
            return assistanceYear === year && assistanceMonth === month && assistanceDay === day;
        });

        if (assistancesToday.length === 0) {
            return res.status(400).json({ success: true, message: 'No hay assistencias registradas hoy', data: assistancesToday });
        }
        const assistancesWithAffiliate = await Promise.all(assistancesToday.map(async (assistance) => {
            const affiliate = await Affiliate.findOne({
                numeroDocumento: assistance.numeroDocumento,
            });
            const suscription = await AffiliateSuscription.findOne({
                idAfiliado: affiliate._id,
                activo: true,
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
        const affiliatesWithSuscriptions = await AffiliateSuscription.find({ activo: true }).populate('idAfiliado');
        const allAssistances = await Assistance.find();
        const day = Number(moment(new Date()).utcOffset('-05:00').format('DD'));
        const nonAttendanceAffiliates = [];

        affiliatesWithSuscriptions.forEach((affiliateSuscription) => {
            const numeroDocumento = affiliateSuscription.idAfiliado.numeroDocumento;
            let hasAttendance = false; // Flag to track attendance

            for (let i = 0; i < allAssistances.length; i++) {
                const assistanceDay = Number(
                    moment(allAssistances[i].fechaDeAsistencia).utcOffset('-05:00').format('DD')
                );
                if (allAssistances[i].numeroDocumento === numeroDocumento && assistanceDay === day) {
                    hasAttendance = true; // Mark attendance found
                    break; // No need to check further
                }
            }

            // If there is no attendance for the current affiliate, add them to the nonAttendanceAffiliates array
            if (!hasAttendance) {
                nonAttendanceAffiliates.push(affiliateSuscription);
            }
        });

        return res.status(200).json({ success: true, message: 'ok', data: nonAttendanceAffiliates });
    } catch (error) {
        console.error(error);
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