const {validationResult}  = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DoctorModel = require('../models/Users/doctor');
const PatientModel = require('../models/Users/patient');


exports.signUp = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body. firstName;
    const lastName = req.body. lastName;
    const cadre = req.body.cadre;
    const department = req.body.department;
    const age = req.body.age;

    bcrypt.hash(password,12)
    .then(hashedPw => {
        const user = new DoctorModel({
            email: email,
            password:hashedPw,
            firstName,lastName
            ,cadre,department,
            age
        })
       return user.save()
    }) 
    .then(result => {
        res.status(201).json({
            message: 'User is created',
            userId: result._id
        })
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 500;
        next(err)
    })
    
}

exports.login = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loginUser;
    UserModel.findOne({email:email})
    .then(user =>{
        if(!user){
            const error = new Error('Not a registered User');
            error.statusCode = 401;
            throw error;
        }
        loginUser = user;
        return bcrypt.compare(password,user.password)
    })
    .then(isEqual => {
        if(!isEqual){
            const error = new Error('wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email:loginUser.email,
            userId:loginUser._id.toString()
        },'my secret life',{expiresIn: '1hr'});
        res.status(200).json({
            message:'login sucessful!',
            token: token,
            userId:loginUser._id.toString()
        })
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 500;
        next(err)
    })
}