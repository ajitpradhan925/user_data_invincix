const express = require('express');
const User = require('../models/User');

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

            const unique_name = first_name.substring(0, 3);
            const date = dob.substring(5, 7);
            const month = dob.substring(8, 10);
            const uniqueCode = unique_name + date + month;


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
    .get(async (req, res, next) => {
        await User.find((err, success) => {
            if (err) next();
            res.json({
                success: true,
                total: success.length,
                user: success,

            })
        })
    })
    /**
     * Update User
     */
    .put( async (req, res, next) => {
        try {
          let user = await User.findById(req.query.userId);
      
          if (!user) {
            return next(`User data not available with id ${req.query.userId}`, 404);
          }
      
          
          user = await User.findByIdAndUpdate(req.query.userId, req.body, {
              new: true,
              runValidators: true
            });
          
            res.status(200).json({ success: true, message: "Successfully updated user.", data: user });
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
    



module.exports = router;