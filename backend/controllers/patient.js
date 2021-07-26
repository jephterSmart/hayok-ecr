const fs = require('fs')
const path = require('path')

const socket = require('../socket');

const {validationResult} = require('express-validator/check');

const PatientModel = require('../models/Users/patient');
const CadreModel = require('../models/Users/cadre');

exports.getPatients = (req,res,next) => {
    // console.log(req.headers);
    const criteria = req.query.criteria;
    const value= req.query.value;
    const operation = req.query.operation;
  
    const perPage = req.get('PerPage') || 5;
    const currentPage = req.get('CurrentPage') || 1;
    let match ={}
   if((criteria && value) || operation ){
        let compAge =new Date (new Date() - value * 365 *24*60*60*1000);
        if(criteria=='age' && operation=='less-than'){
            
            match[criteria] ={
                $gte: compAge
            }

        }
        if(criteria =='age' && operation == 'equal'){
            match[criteria] ={
                $eq: compAge
            }
        }
        if(criteria == 'age' && operation == 'greater-than'){
            match[criteria] ={
                $lte: compAge
            }
        }
        if(criteria == 'gender'){
            match[criteria] ={
                $eq: value
            }
        }
        if(criteria=='bmi' && operation == 'less-than'){
            match[criteria] ={
                $lte: value 
            }
        }
        if(criteria=='bmi' && operation == 'greater-than'){
            match[criteria] ={
                $gte: value 
            }
        }
        if(criteria=='bmi' && operation == 'equal'){
            match[criteria] ={
                $eq: value 
            }
        }

   }
   
    PatientModel.find(match)
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
exports.getPatient = (req,res,next) => {
    PatientModel.findById(req.userId)
    .then(pat => {
        if(!pat){
            const error = new Error("No patient with this Id in our system");
            error.statusCode = 404;
            throw error;
        }
        pat.logInTime = new Date().toLocaleString();
        return pat.save()

    })
    .then(savedPatient => {
        const options = {
            path: 'encounters',
            populate:{
                path:'cadre',
                model:'Cadre',
                select:'cadre firstName lastName _id'
            }
        }
        return savedPatient.populate(options).execPopulate()
    })
    .then(updatedPatient =>{
        res.status(200).json({
            message:'Fetch profile was successful!!!',
            profile: updatedPatient}
        )
    })
    .catch(err => next(err))
}

exports.postPatient = (req,res,next) => {
    const {firstName,lastName,age,gender,height,weight,ward,lga,state} = req.body;
    let updatedPatient;

    const image = req.body.imageData;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('There is a validation error');
        error.statusCode = 422;
        error.errors = errors.array()[0];
        throw error;
        
    }
    
    //Check if the user already exists in our system.
     PatientModel.findOne({firstName: firstName.toLowerCase(),lastName:lastName.toLowerCase()})
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
     
    const filePath = path.join(__dirname,'..','images',lastName.toLowerCase()+firstName.toLowerCase()+'.png');
  
   
   //ensure that the image is saved before continueing
   
   fs.writeFileSync(filePath, Buffer.from(image.png,'base64'));

    //calculate body mass index (BMI)
    const bmi = weight/(height * height) || 0;
    const patient = new PatientModel({
        firstName:firstName.toLowerCase(),lastName:lastName.toLowerCase(),
        imageUrl: path.join('images',lastName.toLowerCase()+firstName.toLowerCase()+'.png').replace('\\','/'), //for it to be compatible with server system
        creator: req.userId,
        age, ward,height,weight,bmi,lga,state,gender
    })
    patient.save()
    .then(savedPatient => {
        return  savedPatient.populate('creator','firstName lastName _id').execPopulate() 
    })
    .then(updatedPat =>{
        updatedPatient = updatedPat;
        return getStatistics();
        
    })
    .then(stat => {
        socket.getIO().emit('statistics',stat);
        res.status(201).json({
            message:'patient created',
            patient:updatedPatient
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
            const encounter = encounters.find(ele => ele.cadre.toString() === req.userId.toString() );
            if(encounter){
                const error = new Error(`You do have encounter with this patient or 
                his file has been transferred to you, Please select repeat`);
                error.statusCode = 422;
                throw error;
            }
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
const getStatistics = () => {
    const ages = ['0-19','20-39','40-59','60-79','80-99','100-119']
  return  PatientModel.find()
    .then(patients => {
        if(!patients){
            const error = new Error('No patient yet available');
            throw error;
        }
        let ageObj = {
            '0-19':0,
            '20-39':0,
            '40-59':0,
            '60-79':0,
            '80-99':0,
            '100-119':0
        };
        let genderObj ={
            female:0,
            male:0,
        };
        patients.forEach(patient => {
            
            ages.forEach(age => {
                let ageBracket =  age.split('-');
              
                ageBracket[0] = new Date(new Date() - Number(ageBracket[0])* 365* 24 * 60 * 60*1000);
                ageBracket[1] = new Date(new Date() - Number(ageBracket[1])* 365* 24 * 60 * 60*1000);
                if(patient.age >= ageBracket[1] && patient.age <= ageBracket[0] ){
                    ageObj[age] =  ageObj[age] + 1 ;
                }
            });
            genderObj[patient.gender] = genderObj[patient.gender] + 1 ;
        })
        let obj = {
            age:ageObj,
            gender:genderObj
        }
        return obj;
    })
    .catch(err => {throw new Error(err.message)})
}
exports.getPatientsStatistics = (req, res,next) => {
    getStatistics()
    .then(stat => {
        res.status(200).json({
            message:"Statistics of age and gender fetched successfully!",
            statistics: stat
        })
    })
    .catch(err => next(err));
}



