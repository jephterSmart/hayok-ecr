const fs = require('fs')
const path = require('path')

const {validationResult} = require('express-validator/check');

const PatientModel = require('../models/Users/patient')

exports.getPatients = (req,res,next) => {
    
    const perPage = req.get(PerPage) || 5;
    const currentPage = req.get(CurrentPage) || 1;
    
    PatientModel.find()
        .sort({createdAt: -1})
        .skip((currentPage -1) * perPage)
        .limit(perPage)
    .then(patients => {
        const opts = [{path:'creator',select:'firstName lastName department'}];
        PatientModel.populate(patients,opts)
        .then(updatedPatients => {
            res.status(200).json({
                patients: updatedPatients,
                message: "Patients gotten successfully"
            })
        }).catch(console.log)
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
}


exports.postPatient = (req,res,next) => {
    const {firstName,lastName,age,gender,height,weight,ward,lga,state} = req.body;
    const image = req.file;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('There is a validation error');
        error.statusCode = 422;
        error.errors = errors.array()[0];
        throw error;
        
    }
    if(!image){
        const error = new Error('Picture is required for the patient');
        error.statusCode = 422; //validation error
        throw error;
    }
    //calculate body mass index (BMI)
    const bmi = weight/(height * height);
    const patient = new PatientModel({
        firstName,lastName,
        imageUrl: image.path.replace('\\','/'), //for it to be compatible with windows
        creator: req.userId,
        age, ward,height,weight,bmi,lga,state,gender
    })
    patient.save()
    .then(savedPatient => {
        return  savedPatient.populate('creator','firstName lastName _id').execPopulate() 
    })
    .then(updatedPatient =>{
        res.status(201).json({
            message:'patient created',
            patient:updatedPatient,
        })
    
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;

        }
        next(err);
    });
    
    

    
}
