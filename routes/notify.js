const msg91 = require('msg91')
    (process.env.MSG91_AUTH_API, process.env.MSG91_SENDER_ID, process.env.MSG91_ROUTING_NO);
const express = require('express');
const router = express.Router();
const Notify = require('../models/Notify');
const User = require('../models/User');
const async = require('async');



router.get('/sms',async (req, res, next) => {
    const flag = req.query.flag;
    const UniqueCode = req.query.uniqueCode;
    const repliedUnicode = req.query.repliedUnicode;


    var msg = '';
    var mobileNo = process.env.MOBILE_NO;
    if (flag === process.env.FLAG_1) {
        msg = "'" + UniqueCode + "'" + ' has requested ' + flag + '.';

       
        
        User.findOne({ uniqueCode: UniqueCode }, (err, user) => {
            if(err) console.log(err);
            console.log(user)
            if (user){
                console.log(user)
               
                if (saveNotifyToDB(UniqueCode, flag, repliedUnicode, null)) {
                    // sendSms(msg, mobileNo);
                    return res.json({
                        success: true,
                        msg: "Successfully notified"
                    });
                } else {
                    return res.json({
                        success: false,
                        msg: "Some problem occured"
                    });
                }

                
            } else {
                
                res.status(404).json({
                    success: false,
                    msg: "Unique code is not valid."
                });
            }
               
        });
        
        
    }
    else if (flag === process.env.FLAG_2) {
        msg = "'" + UniqueCode + "'" + ' has replied for ' + repliedUnicode + '.';


        async.parallel([

            function(callback) {
                User.findOne({ uniqueCode: UniqueCode }, (err, user) => {
                    if(err) return next(err);

                    callback(err, user);
                });
            },

            function(callback) {
                User.findOne({ uniqueCode: repliedUnicode }, (err, user) => {
                    if(err) return next(err);

                    callback(err, user);
                });
            }
        ], function(err, results) {

            var userUniqueCode = results[0];
            var userRepliedUniqueCode = results[1];

            console.log(userUniqueCode)

            if(userUniqueCode) {

                if(userRepliedUniqueCode) {

                    if (saveNotifyToDB(UniqueCode, flag, repliedUnicode, null)) {
                        sendSms(msg, mobileNo);
                        return res.status(200).json({
                            success: true,
                            msg: "Successfully notified"
                        });
                    } else {
                        return res.status(404).json({
                            success: false,
                            msg: "Some problem occured"
                        });
                    }
                 
                } else {
                    res.status(404).json({
                        success: false,
                        msg: "No user having this unique code ."
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    msg: "Unique code is not valid."
                });
            }
            
        }

        );




    }
    else if (flag === process.env.FLAG_3) {
        msg = "'" + UniqueCode + "'" + ' has passed ' + repliedUnicode + '.';

        async.parallel([

            function(callback) {
                User.findOne({ uniqueCode: UniqueCode }, (err, user) => {
                    if(err) return next(err);

                    callback(err, user);
                });
            },

            function(callback) {
                User.findOne({ uniqueCode: repliedUnicode }, (err, user) => {
                    if(err) return next(err);

                    callback(err, user);
                });
            }
        ], function(err, results) {

            var userUniqueCode = results[0];
            var userRepliedUniqueCode = results[1];

            console.log(userUniqueCode)

            if(userUniqueCode) {

                if(userRepliedUniqueCode) {

                    if (saveNotifyToDB(UniqueCode, flag, repliedUnicode, null)) {
                        sendSms(msg, mobileNo);
                        return res.status(200).json({
                            success: true,
                            msg: "Successfully notified"
                        });
                    } else {
                        return res.status(404).json({
                            success: false,
                            msg: "Some problem occured"
                        });
                    }
                 
                } else {
                    res.status(404).json({
                        success: false,
                        msg: "No user having this unique code ."
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    msg: "Unique code is not valid."
                });
            }
            
        }

        );
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