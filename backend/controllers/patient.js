const fs = require('fs')
const path = require('path')

const atob = require('atob');

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

    const image = req.body.imageData;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('There is a validation error');
        error.statusCode = 422;
        error.errors = errors.array()[0];
        throw error;
        
    }
    
    //Check if the user already exists in our system.
     PatientModel.findOne({firstName: firstName,lastName:lastName})
         .then(result => {
             if(result) 
             throw new Error("We can't have duplicate User in our system");
         })
         .catch(err => {
             if(!err.statusCode){
                 err.statusCode = 500;
             }
             next(err);
         })
     
    const filePath = path.join(__dirname,'..','images',lastName+firstName+'.png');
  
   
   //ensure that the image is saved before continueing
   
   fs.writeFileSync(filePath, Buffer.from(image.png,'base64'));

    //calculate body mass index (BMI)
    const bmi = weight/(height * height) || 0;
    const patient = new PatientModel({
        firstName,lastName,
        imageUrl: path.join('images',lastName+firstName+'.png').replace('\\','/'), //for it to be compatible with server system
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
