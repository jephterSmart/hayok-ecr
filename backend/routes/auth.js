const express = require('express');
const {body} = require('express-validator/check');

const authController = require('../controllers/auth');
const Doctormodel = require('../models/Users/cadre');


const router = express.Router();

router.put('/signup',[
    body('email').isEmail().withMessage('Not a valid email').custom((value,{req}) => {
       return Doctormodel.findOne({email: value})
        .then(result => {
            if(result) 
            return Promise.reject('User already exist with that email');
        })
    }).normalizeEmail(),
    body('password','password must be atleast 5 characters').trim().isLength({min:5}),
    body('firstName','First name must be provided').trim().not().isEmpty(),
    body('surname','Last name must be provided').trim().not().isEmpty(),
],authController.signUp);

// router.put('/login/patient',[
//     body('firstName').trim().not().isEmpty(),
//     body('lastName').trim().not().isEmpty()
// ],authContoller.patientSignUp);

router.post('/login',[
    body('email', 'Put in a valid Email or Password').trim().isEmail()
],authController.login)
router.post('/patient/login',[
    body('firstName','First Name  must be more than 2 characters').trim().isLength({min:2}),
    body('lastName','Last Name must be more than 2 characters').trim().isLength({min:2})
],authController.patientLogin);
module.exports = router;