const express = require('express');
const {body}  = require('express-validator/check');

const UserController = require('../controllers/patient');

const isAuth = require('../middleware/isAuth');

const router = express.Router();

//=> GET /user/patients
router.get('/patients',isAuth,UserController.getPatients);

//=> GET a singel patient, i.e, his profile
router.get('/patient',isAuth,UserController.getPatient)

// => post a patient /user/add-patient
router.post('/add-patient', isAuth, [
    body('firstName','Must be more than 3 characters').trim().isLength({min:3}),
    body('lastName','Must be more than 3 characters').trim().isLength({min:3})
],UserController.postPatient);

//=> update the patient data /user/patients/:patientId
router.patch('/patients/:patientId',isAuth,UserController.updatePatientProfile);

module.exports = router;