const fs = require('fs')
const path = require('path')



const {validationResult} = require('express-validator/check');

const PatientModel = require('../models/Users/patient');
const CadreModel = require('../models/Users/cadre');

exports.getPatients = (req,res,next) => {
    // console.log(req.headers);
    const perPage = req.get('PerPage') || 5;
    const currentPage = req.get('CurrentPage') || 1;
    console.log(perPage,currentPage);
    PatientModel.find()
        .sort({logInTime: -1, updatedAt: -1})
        .skip((+currentPage -1) * perPage)
        .limit(+perPage)
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

exports.updatePatientProfile = (req,res,next) => {
    
    const patientId = req.params.patientId;
    let cadre;
    const {weight,height,timeOfEncounter,dateOfEncounter,bloodPressure,
        temperature,respiratoryRate,complaints,treatmentPlan,diagnosis,visits} = req.body
    CadreModel.findById(req.userId)
    .then(cad => {
        if(!cad){
            const err = new Error("User does not exist in our system");
            err.statusCode = 404;
            throw err
        }
        
        return cad;
    })
    .then(cad => {
        cadre = cad;
        return PatientModel.findById(patientId)
    })
    .then(patient =>{
        if(!patient){
            const error = new Error("There is no such patient in our database");
            error.statusCode = 404;
            throw error;
        }
        const bmi = Number(weight)/Number(height ** height);
        patient.weight = weight;
        patient.height = height;
        patient.bloodPressure = bloodPressure;
        patient.temperature = temperature;
        patient.respiratoryRate = respiratoryRate;
        patient.complaints = complaints;
        patient.treatmentPlan = treatmentPlan;
        patient.diagnosis = diagnosis;
        patient.bmi = bmi;
        if(visits === 'firstTime'){
            const encounters = patient.encounters;
            encounters.push({
                dateOfEncounters: [dateOfEncounter],
                timeOfEncounters: [timeOfEncounter],
                cadre: cadre ,
                numberOfEncounter: 1
            })
            cadre.patients.push(patient);
            cadre.save()
            .then(saveCadre => {
                
            })
            .catch(err => {
                throw new Error('Unable to save');
            })
        }
        else{
            const  encounters = patient.encounters;
            const encounter = encounters.find(ele => ele.cadre.toString() === req.userId.toString() );
            if(!encounter){
                const error = new Error('You do not have encounter with this patient, Please select first time');
                error.statusCode = 422;
                throw error;
            }
            encounter.dateOfEncounters.push(dateOfEncounter);
            encounter.timeOfEncounters.push(timeOfEncounter);
            encounter.numberOfEncounter++;
        }
        return patient.save()
    })
    .then(savedPatient => {
        const opt ={
            path: 'encounters',
            populate: {
                path: 'cadre', 
                model: 'Cadre',
                select: 'firstName lastName cadre _id'
            }
        }
        return  savedPatient.populate(opt).execPopulate() 
    })
    .then(updatedPatient =>{
       
        res.status(200).json({
            message:'patient updated',
            patient:updatedPatient,
        })
        
    })
     .catch(err => {
        if(!err.statusCode) err.statusCode = 500 ;      
        next(err);
    })
}

