const express = require('express');
const router = express();
const QRCode = require('qrcode')
const QrSchema = require('../models/QrCode');

router.get('/', async (req, res, next) => {


    // Generate random number
    var random_number = "K-" + Math.floor(100000 + Math.random() * 900000);

    // Convert random number to base64 string
    QRCode.toDataURL(random_number, function (err, url) {

        // Store to db
        const qr_schema = new QrSchema();
        qr_schema.base64_text = url;

        qr_schema.save((err, qr) => {
            if (err) next(err);

            if (qr) {
                res.json({
                    success: true,
                    base64: qr
                });
            }
        })

    });

});


module.exports = router;