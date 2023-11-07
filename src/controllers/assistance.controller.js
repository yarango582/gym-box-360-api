const Assistance = require('../models/assistance.model');
const Affiliate = require('../models/affiliates.model');
const AffiliateSuscription = require('../models/affiliatesSuscription.model');
const moment = require('moment-timezone');

const colombiaTime = moment().tz('America/Bogota');
const today = colombiaTime.format('YYYY-MM-DD HH:mm:ss');

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
            fechaDeAsistencia: new Date(),
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

        const assistancesWithAffiliate = await Promise.all(assistances.map(async (assistance) => {
            const affiliate = await Affiliate.findOne({
                numeroDocumento: assistance.numeroDocumento,
            });
            const suscription = await AffiliateSuscription.findOne({
                idAfiliado: affiliate._id,
            }).sort({ fechaDePago: -1 });
            return {
                ...assistance,
                affiliate: affiliate,
                suscription: suscription,
            };
        }));
        if (!assistancesWithAffiliate.length) {
            return res.status(404).json({ success: false, error: `Asistencias no encontradas` });
        }
        return res.status(200).json({ success: true, message: 'ok', data: assistancesWithAffiliate });
    } catch (err) {
        console.error(err);
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
        const colombiaTime = moment().tz('America/Bogota');
        const year = colombiaTime.format('YYYY');
        const month = colombiaTime.format('MM');
        const day = Number(colombiaTime.format('DD'));

        const assistances = await Assistance.find();
        if (!assistances.length) {
            return res.status(404).json({ success: false, error: `Asistencias no encontradas` });
        }

        const assistancesToday = assistances.filter((assistance) => {
            const assistanceYear = moment(assistance.fechaDeAsistencia).tz('America/Bogota').format('YYYY');
            const assistanceMonth = moment(assistance.fechaDeAsistencia).tz('America/Bogota').format('MM');
            const assistanceDay = Number(moment(assistance.fechaDeAsistencia).tz('America/Bogota').format('DD'));
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
        // Obtén la fecha actual en la zona horaria de Colombia
        const colombiaTime = moment().tz('America/Bogota');
        const day = Number(colombiaTime.format('DD'));

        // Obtén afiliados con suscripciones activas
        const affiliatesWithSuscriptions = await AffiliateSuscription.find({ activo: true }).populate('idAfiliado');
        const allAssistances = await Assistance.find();

        const nonAttendanceAffiliates = [];

        affiliatesWithSuscriptions.forEach((affiliateSuscription) => {
            const numeroDocumento = affiliateSuscription.idAfiliado.numeroDocumento;
            let hasAttendance = false; // Flag to track attendance

            allAssistances.forEach((assistance) => {
                // Obtén el día de la asistencia en la zona horaria de Colombia
                const assistanceDay = Number(moment(assistance.fechaDeAsistencia).tz('America/Bogota').format('DD'));

                if (assistance.numeroDocumento === numeroDocumento && assistanceDay === day) {
                    hasAttendance = true; // Marcar asistencia encontrada
                    return; // No es necesario verificar más
                }
            });

            // Si no hay asistencia para el afiliado actual, agrégalo a la matriz nonAttendanceAffiliates
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