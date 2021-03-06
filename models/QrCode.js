const mongoose = require('mongoose');

const QrSchema = new mongoose.Schema({
    base64_text: String,
    qr_code_value: String,
    generated_at: {
        type: Date,
        default: Date.now
    }
})



module.exports = mongoose.model('QrCode', QrSchema);