const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({

        first_name: {
            type: String
        },
        last_name: {
            type: String
        },
        dob: {
            type: Date
        },
        mobile_number: {
            type: String,
            reqired: true,
            unique: true
        },
        address: {
            type: String
        },
        email: {
            type: String
        },
        uniqueCode:String

})



module.exports = mongoose.model('UserData', UserSchema);