const mongoose = require('mongoose');

const NotifySchema = mongoose.Schema({

        userUniqueCode: {
            type: String
        },
        flag: {
            type: String
        },
        replyFor: {
            type: String
        },
        letterCode: {
            type: String
        },
        notifiedAt: {
            type: Date,
            default: Date.now
        }

})



module.exports = mongoose.model('Notify', NotifySchema);