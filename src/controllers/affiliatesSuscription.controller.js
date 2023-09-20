const affiliatesSuscriptionModel = require('../models/affiliatesSuscription.model');
const paymentsModel = require('../models/payments.model');

const createAffiliateSuscriptionOrUpdate = async (req, res) => {
    try {
        const reqBody = req.body;

        if (!reqBody) {
            return res.status(400).json({
                success: false,
                error: "Debes proveer un afiliado",
            });
        }

        const isAffiliateSuscriptionCreated = await affiliatesSuscriptionModel.findOne({ idAfiliado: reqBody.idAfiliado });

        // update suscription
        if (isAffiliateSuscriptionCreated) {
            await affiliatesSuscriptionModel.updateOne({ idAfiliado: reqBody.idAfiliado }, reqBody);
            const payment = new paymentsModel({
                idAfiliado: reqBody.idAfiliado,
                fechaDePago: reqBody.fechaDePago,
                medioDePago: reqBody.medioDePago,
                valorDePago: reqBody.valorDePago,
            });
            await payment.save();
            return res.status(201).json({
                success: true,
                message: "Suscripcion actualizada correctamente y pago registrado!",
            });
        }

        // create suscription
        const affiliateSuscription = new affiliatesSuscriptionModel(reqBody);

        // create payment
        const payment = new paymentsModel({
            idAfiliado: reqBody.idAfiliado,
            fechaDePago: reqBody.fechaDePago,
            medioDePago: reqBody.medioDePago,
            valorDePago: reqBody.valorDePago,
        });

        if (!affiliateSuscription || !payment) {
            return res.status(400).json({ success: false, message: err });
        }

        await affiliateSuscription.save();
        await payment.save();

        return res.status(201).json({
            success: true,
            id: affiliateSuscription._id,
            message: "Suscripcion creada correctamente!",
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success:false,
            error,
            message: "La suscripcion no fue creada, intenta mas tarde!",
        });
    }
};

module.exports = {
    createAffiliateSuscriptionOrUpdate,
};