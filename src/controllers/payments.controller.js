const paymentsModel = require('../models/payments.model');

const createPayment = async (req, res) => {

    try {
        const reqBody = req.body;

        if (!reqBody) {
            return res.status(400).json({
                success: false,
                error: "Debes proveer un pago",
            });
        }

        const payment = new paymentsModel(reqBody);

        if (!payment) {
            return res.status(400).json({ success: false, message: err });
        }

        await payment.save();
        return res.status(201).json({
            success: true,
            id: payment._id,
            message: "Pago almacenado correctamente!",
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: "El pago no fue creado, intenta mas tarde!",
        });
    }

};

module.exports = {
    createPayment,
}