const AffiliateSuscriptionModel = require('../models/affiliatesSuscription.model');
const PaymentsModel = require('../models/payments.model');

const createAffiliateSuscriptionOrUpdate = async (req, res) => {

    const reqBody = req.body;

    if (!reqBody) {
        return res.status(400).json({
            success: false,
            error: "You must provide an affiliate suscription",
        });
    }

    try {

        const isSuscriptionCretead = await AffiliateSuscriptionModel.findOne({ idAfiliado: reqBody.idAfiliado, activo: true });

        if (isSuscriptionCretead && isSuscriptionCretead.activo) {
            // acualizar suscripcion y suma la cantidad de mesesPagados, tambien registra el pago en payments
            const affiliateSuscription = await AffiliateSuscriptionModel.findOneAndUpdate({ idAfiliado: reqBody.idAfiliado, activo: true }, { $inc: { mesesPagados: reqBody.mesesPagados } }, { new: true });
            const payment = new PaymentsModel(reqBody);
            await payment.save();
            return res.status(201).json({
                success: true,
                message: "Suscripcion actualizada correctamente!",
                data: affiliateSuscription,
            });
        }

        if (isSuscriptionCretead && !isSuscriptionCretead.activo) {
            // crear suscripcion y registra el pago en payments
            // sumo un mes a la fecha anterior de pago para mantener el mismo corte
            const newDate = moment(isSuscriptionCretead.fechaDePago).add(1, 'months').toDate();
            const affiliateSuscription = new AffiliateSuscriptionModel({
                idAfiliado: reqBody.idAfiliado,
                mesesPagados: reqBody.mesesPagados,
                fechaDePago: newDate,
                activo: true
            });
            const payment = new PaymentsModel(reqBody);
            await payment.save();
            await affiliateSuscription.save();
            return res.status(201).json({
                success: true,
                id: affiliateSuscription._id,
                message: "Suscripcion creada correctamente!",
                data: affiliateSuscription,
            });
        }

        const affiliateSuscription = new AffiliateSuscriptionModel(reqBody);

        if (!affiliateSuscription) {
            return res.status(400).json({ success: false, message: 'La suscription no fue creada, intenta mas tarde!' });
        }

        const payment = new PaymentsModel(reqBody);
        await payment.save();
        await affiliateSuscription.save();

        return res.status(201).json({
            success: true,
            id: affiliateSuscription._id,
            message: "Suscripcion creada correctamente!",
            data: affiliateSuscription,
        });

    } catch (err) {
        console.log(err);
        return res.status(400).json({
            err,
            message: "La suscripcion no fue creada, intenta mas tarde!",
        });
    }


}


const getAffiliateSuscriptionById = async (req, res) => {
    try {
        const data = req.params;
        const affiliateSuscription = await AffiliateSuscriptionModel.findOne({ idAfiliado: data.idAfiliado, activo: true });

        if (!affiliateSuscription) {
            return res.status(404).json({
                success: false,
                message: "No se encontraron suscripciones activas",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Hay una suscripcion activa",
            data: affiliateSuscription,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error,
            message: "No se encontraron suscripciones activas",
        });
    }
};

module.exports = {
    createAffiliateSuscriptionOrUpdate,
    getAffiliateSuscriptionById,
};