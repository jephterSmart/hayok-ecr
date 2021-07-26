

const socket = require('../socket');


const {validationResult} = require('express-validator/check');

const PatientModel = require('../models/Users/patient');
const CadreModel = require('../models/Users/cadre');

exports.getAllCadre = (req,res, next) => {
    //we don't need any patient data, therefor no need to pupulate.
    CadreModel.find()
    .then(cadre => {
        res.status(200).json({
            employees:cadre,
            message:'Fetch Successful!'
        })
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    })
}
exports.updateEmployeeInfo = (req,res,next) => {
    const {fromId,patientId,toId} = req.body;
    let patient;
    let fromDoctor;
    let saveToDoctor;

    CadreModel.findById(fromId||req.userId)
    .then(cadre => {
        if(!cadre){
            const error = new Error("No employee found");
            error.statusCode = 404;
            throw error;
        }
        // This is done in case we're trying to send a patient file we've not encountered
        patient =  cadre.patients.find(ele => ele.toString() === patientId.toString())
        if(!patient){
            const error = new Error("No Patient found");
                error.statusCode = 404;
                throw error;
        }
        fromDoctor = cadre;
        return CadreModel.findById(toId)
        
    })
    .then(toDoctor => {
        if(!toDoctor){
            const error = new Employee('No employee found');
            error.statusCode = 404;
            throw err;
        }
        toDoctor.patients.push(patient)
        fromDoctor.patients.pull(patientId);
        //Also update the notification of the doctor the message is patient is been sent to
        toDoctor.notifications.push({
            from:fromDoctor,
            patient:patient
        })
        return toDoctor.save();
    } )
    .then(doc => {
        console.log(doc);
        saveToDoctor = doc;
        return fromDoctor.save()
    })
    .then(savedFromDoctor => {

        return PatientModel.findById(patientId)
        
    })
    .then(patient => {
        if(!patient){
            const error = new Error('No patient with this Id');
            error.statusCode = 422;
            throw error;
        }
        let encounter =patient.encounters
        .find(encounter => encounter.cadre.toString() === saveToDoctor._id.toString())
        let encInd = patient.encounters
        .findIndex(encounter => encounter.cadre.toString() === saveToDoctor._id.toString())
        const today = new Date();
        if(encounter){
            patient.encounters[encInd].dateOfEncounters.push(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());
            patient.encounters[encInd].timeOfEncounters.push(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
            patientencounters[encInd].numberOfEncounter++;
            
        }
        else{
            patient.encounters.push({
                dateOfEncounters: [today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()],
                timeOfEncounters: [today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()],
                cadre: saveToDoctor._id,
            })
        }
       return patient.save()
    })
    .then(savedPatient => {
        socket.getIO().emit('notifications',{from:fromDoctor,to:saveToDoctor,patient:savedPatient})
     
        res.status(201).json({
            message:'Patient file has been sent!',
            profile: fromDoctor
        })
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    })
    
}


exports.getNotifications = (req,res,next) => {
    CadreModel.findById(req.userId)
    .then(doctor => {
        if(!doctor){
            const error = new Error("doctor cannot be found");
            error.statusCode = 404;
            throw error 
        }
        const opts1 ={
            path:'notifications',
            populate:{
                path:'from',
                model:"Cadre",
                select:'firstName lastName _id cadre'
            }
        }
      
        return doctor.populate(opts1).execPopulate()
        
    })
    .then(halfPopulate => {
        const opts2 = {
            path:'notifications',
            populate:{
                path:'patient',
                model:"Patient"
            }
        }
        return halfPopulate.populate(opts2).execPopulate()
    })
    .then(updatedDoc => {
        res.status(200).json(
            {
                message:"Notification fetch successful",
                notifications: updatedDoc.notifications
            }
        )
    })
    .catch(err => {
        next(err);
    })
}
exports.changeNotification = (req,res,next) => {
    const notId = req.params.notificationId;
    const seen = req.body.seen.toString()
    CadreModel.findById(req.userId)
    .then(doctor => {
        if(!doctor){
            const error = new Error("Not a registered user");
            error.statusCode = 404;
            throw error;
        }
        const notification = doctor.notifications.find(ele => ele._id.toString() === notId.toString())
        if(!notification){
            const error = new Error("Notification not in our database");
            error.statusCode = 401;
            throw error;
        }
        if(seen === "false" )
        notification.seen = false;
        else notification.seen = true;
        const notInd = doctor.notifications.findIndex(ele => ele._id.toString() === notId.toString());
        doctor.notifications[notInd] = notification;
        return doctor.save();
    })
    .then(updatedDoctor => {
        res.status(200).json({
            message:"Notification has been viewed",
            notifications: updatedDoctor.notifications
        })
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 404;
        next(err);
    })
}