const express = require('express');
const {body}  = require('express-validator/check');

const CadreController = require('../controllers/cadre');

const isAuth = require('../middleware/isAuth');

const router = express.Router();

// => used for getting all the employees we have in our system /employees/all
router.get('/all', isAuth, CadreController.getAllCadre);

// => update employee(cadre) information /employees/update-cadre
router.patch('/update-cadre',isAuth,CadreController.updateEmployeeInfo);

//=> get Employees/notifications 
router.get('/notifications',isAuth,CadreController.getNotifications)


//=> change notification value to seen
router.patch('/:notificationId',isAuth,CadreController.changeNotification);

module.exports = router;