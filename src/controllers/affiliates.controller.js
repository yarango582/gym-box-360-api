const Affiliate = require("../models/affiliates.model");

const createAffiliate = async (req, res) => {
    const reqBody = req.body;

    if (!reqBody) {
        return res.status(400).json({
            success: false,
            error: "You must provide an affiliate",
        });
    }

    const isAffiliateCreated =  Affiliate.find({ numeroDocumento: reqBody.numeroDocumento });

    if (isAffiliateCreated) {
        return res.status(400).json({
            success: false,
            message: "Affiliate already created",
        });
    }

    const affiliate = new Affiliate(reqBody);

    if (!affiliate) {
        return res.status(400).json({ success: false, error: err });
    }

    try {
        await affiliate.save();

        return res.status(201).json({
            success: true,
            id: affiliate._id,
            message: "Affiliate created!",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            err,
            message: "Affiliate not created!",
        });
    }
};

const getAffiliates = async (req, res) => {
    try {
        const affiliates = await Affiliate.find();
        if (!affiliates.length) {
            return res.status(404).json({ success: false, error: `Affiliates not found` });
        }
        return res.status(200).json({ success: true, data: affiliates });
    } catch (err) {
        return res.status(400).json({ success: false, error: err });
    }
};

module.exports = {
    createAffiliate,
    getAffiliates,
};