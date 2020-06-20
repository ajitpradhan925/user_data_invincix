const msg91 = require('msg91')
    (process.env.MSG91_AUTH_API, process.env.MSG91_SENDER_ID, process.env.MSG91_ROUTING_NO);
const express = require('express');
const router = express.Router();
const Notify = require('../models/Notify');


router.get('/sms',async (req, res, next) => {
    const flag = req.query.flag;
    const UniqueCode = req.query.uniqueCode;
    const repliedUnicode = req.query.repliedUnicode;


    if(flag == process.env.FLAG_1) {

        if(saveNotifyToDB(UniqueCode, flag, repliedUnicode, null)) {
            var msg = "'"+UniqueCode+"'" + ' has requested ' + flag +'.';
            var mobileNo = process.env.MOBILE_NO;
            sendSms(msg,mobileNo);

            return res.json({
                success: true,
                msg: "Successfully notified"
            })
        } else {
            return res.json({
                success: false,
                msg: "Some problem occured"
            })
        }

    } else if(flag == process.env.FLAG_2) {
        

        if(saveNotifyToDB(UniqueCode, flag, repliedUnicode, null)) {
            var msg = "'"+UniqueCode+"'" + ' has replied for ' + repliedUnicode +'.';
            var mobileNo = process.env.MOBILE_NO;
            sendSms(msg,mobileNo);

            return res.json({
                success: true,
                msg: "Successfully notified"
            })
        } else {
            return res.json({
                success: false,
                msg: "Some problem occured"
            })
        }


    } else if(flag == process.env.FLAG_3) {

        if(saveNotifyToDB(UniqueCode, flag, repliedUnicode, null)) {
            var msg = "'"+UniqueCode+"'" + ' has passed ' + repliedUnicode +'.';
            var mobileNo = process.env.MOBILE_NO;
            sendSms(msg, mobileNo);

            return res.json({
                success: true,
                msg: "Successfully notified"
            })
        } else {
            return res.json({
                success: false,
                msg: "Some problem occured"
            })
        }


    }

})



// Save notify
function saveNotifyToDB(userUniqueCode, flag, replyFor, letterCode) {
       
    try {
        const notify = new Notify();

        notify.userUniqueCode = userUniqueCode;
        notify.flag = flag;
        notify.replyFor = replyFor;
        notify.letterCode = letterCode;
    
        notify.save((err, success) => {
            if(err) {
                console.log(err)
                return false;
            }

            if(success) {
                return true;
            }
        });

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }


}


// Function to send sms
function sendSms(msg, mobile_number) {

    msg91.send(mobile_number, msg, function(err, response){
        if(err) console.log(err);
        if(response) console.log(response);
    });
}

module.exports = router;