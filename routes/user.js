const express = require('express');
const User = require('../models/User');
var dateFormat = require('dateformat');
const {
    check,
    validationResult
} = require('express-validator');
const router = express.Router();



router.route('/user')
    /**
     * Add user
     */
    .post([
        check('first_name', 'First name is required').not().isEmpty(),
        check('last_name', 'Last name is required').not().isEmpty(),
        check('mobile_number', 'Mobile number is required and should be 10 digits').not().isEmpty().isLength(10),
        check('address', 'Address is required').not().isEmpty(),
        check('dob', 'Date of is required').not().isEmpty(),

    ], async (req, res, next) => {

        // Check Validation using express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        try {
            const {
                first_name,
                last_name,
                dob,
                mobile_number,
                address,
                email
            } = req.body;

            const ts_hms = new Date(dob);

            // console.log(ts_hms.getFullYear());
            // console.log(ts_hms.getMonth()+ 1 );
            // console.log(ts_hms.getDate());

            const unique_name = first_name.substring(0, 3);

            // uniCode
            const uniqueCode = unique_name + '' + ("0" + (ts_hms.getDate())).slice(-2) + '' +
                 ("0" + (ts_hms.getMonth() + 1)).slice(-2);


            const user = new User();

            user.first_name = first_name;
            user.last_name = last_name;
            user.dob = dob;
            user.mobile_number = mobile_number;
            user.email = email;
            user.address = address;
            user.uniqueCode = uniqueCode;

            await user.save();

            res.json({
                success: true,
                msg: "User added to db",
                user: user,

            });
        } catch (error) {
            res.json(error.message);
        }


    })

    /**
     * Get All User
     */
    .get(async (req, res, next) => {
        try {
            await User.find({}, (err, success) => {
                if (err) next();
                res.json({
                    success: true,
                    total: success.length,
                    user: success

                })
            });
        } catch (error) {
            next(error);
        }
    })
    /**
     * Update User
     */
    .put(async (req, res, next) => {
        try {
            let user = await User.findById(req.query.userId);

            if (!user) {
                return next(`User data not available with id ${req.query.userId}`, 404);
            }


            user = await User.findByIdAndUpdate(req.query.userId, req.body, {
                new: true,
                runValidators: true
            });

            res.status(200).json({
                success: true,
                message: "Successfully updated user.",
                data: user
            });
        } catch (error) {
            next(error)
        }

    })
    /**
     * Delete User
     */
    .delete(async (req, res, next) => {
        try {
            let user = await User.findById(req.query.userId);

            if (!user) {
                return next(
                    new Error(`User data not available with id of ${req.params.id}`)
                );
            }

            user = await User.findByIdAndDelete(req.query.userId);

            res.status(200).json({
                success: true,
                msg: 'Successfully deleted'
            });
        } catch (err) {
            next(err.message)
        }

    });





router.get('/user/:userId', async (req, res, next) => {
    try {
        let user = await User.findById(req.params.userId);

        if (!user) {
            return next(
                new Error(`User not found with id of ${req.params.id}`)
            );
        }

        user = await User.findById(req.params.userId);

        res.status(200).json({
            success: true,
            user: user
        });
    } catch (err) {
        next(err.message)
    }

})

module.exports = router;