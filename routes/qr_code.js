const express = require('express');
const router = express();
const QRCode = require('qrcode')
const QrSchema = require('../models/QrCode');




/**
 * ***************** Add Qr Code ******************
 */
router.get('/', async (req, res, next) => {

    var quantity = parseInt(req.query.qr_quantity);

    for (var i = 0; i < quantity; i++) {
        // Store to db
        let qr_schema = new QrSchema();
        // Generate random number
        var random_number = "K-" + Math.floor(100000 + Math.random() * 900000);
        qr_schema.qr_code_value = random_number;

        QRCode.toDataURL(random_number, function (err, url) {

            qr_schema.base64_text = url;
            qr_schema.save();
        });

    }


    res.json({
        success: true,
        msg: "Successfully added " + quantity + " QR CODES."
    });


});



/**
 * ***************** GET ALL QR CODES ******************
 */
router.get('/get_codes', async (req, res, next) => {
    await QrSchema.find((err, qr) => {
        if (err) next();

        if (qr) {
            return res.json({
                success: true,
                total: qr.length,
                qr_code: qr
            })
        }
    })
})
module.exports = router;