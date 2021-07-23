const socket = require('../socket');

const MessageModel = require('../models/message');
const PatientModel = require('../models/Users/patient');
const CadreModel = require('../models/Users/cadre');

exports.postMessage = (req,res,next) => {
    const {fromId,toId,message,fromType} = req.body;
 
    const newMessage = new MessageModel({
        from: fromId,
        to: toId,
        message,
        fromType
    });
    newMessage.save()
    .then(savedMessage => {
        socket.getIO().emit('messages',savedMessage)
     
        res.status(201).json({
            message:'Message has been sent!!!',
            sentMessage:savedMessage
        })
    })
    .catch(err => {
        next(err);
    })
}

exports.getMessages = (req,res,next) => {
   const {from,to,usertype} = req.params;
   
   if(usertype === 'doctor'){
    let doctorFrom;
    let patientTo;
    let FromMessages; //The message doctor sent to this patient
   
       CadreModel.findById(from)
       .then(doctor => {
           if(!doctor){
               const error = new Error('No doctor with this Id');
               error.statusCode = 404;
               throw error;
           }
           doctorFrom = doctor;
           return doctor
       })
       .then( doctor => {
           //go externally
           return PatientModel.findById(to)
           

       } )
       .then(patient => {
        if(!patient){
            const error = new Error('No Patient with this Id');
            error.statusCode = 404;
            throw error;
        }
        patientTo = patient;
        return patient;  
       }).then(patient =>{
           return MessageModel.find({from,to,fromType:usertype})
       })
       .then(messages => {
          const newMessages = messages.map(message => ({
                ...message,
                from:{
                    _id:message.from,
                 firstName: doctorFrom.firstName,
                 cadre:doctorFrom.cadre,
                 lastName:doctorFrom.lastName   
                },
                to:{
                    _id:message.to,
                    firstName:patientTo.firstName,
                    lastName:patientTo.lastName,
                }
            }))
            return newMessages
       })
       .then(newMessages => {
            FromMessages =newMessages;
           return MessageModel.find({from:to,to:from,fromType:'patient'})
       })
       .then(messages => {
        const newMessages = messages.map(message => ({
            ...message,
            from:{
                _id:message.from,
             firstName: patientTo.firstName,
             lastName:patientTo.lastName   
            },
            to:{
                _id:message.to,
                firstName:doctorFrom.firstName,
                cadre: doctorFrom.cadre,
                lastName:doctorFrom.lastName,
            }
        }))
        return newMessages
       })
       .then(newMessages =>{
         const allMessages = newMessages.concat(FromMessages);
            allMessages.sort((a,b) =>{
             return b.createdAt < a.createdAt ? 1 : -1
         })
         res.status(200).json({
             message:"Fetch successful!!!",
             messages: allMessages
         })
        
       })
       
   }
   //The if it is patient that is asking for request
   else{
    let doctorTo;
    let patientFrom;
    let FromMessages; //The message patient sent to this doctor
   
       CadreModel.findById(to)
       .then(doctor => {
           if(!doctor){
               const error = new Error('No doctor with this Id');
               error.statusCode = 404;
               throw error;
           }
          
           return doctor
       })
       .then( doctor => {
           //go externally
           doctorTo = doctor;
           return PatientModel.findById(from)
           

       } )
       .then(patient => {
        if(!patient){
            const error = new Error('No Patient with this Id');
            error.statusCode = 404;
            throw error;
        }
        
        return patient;  
       }).then(patient =>{
        patientFrom = patient;
           return MessageModel.find({from,to,fromType:usertype})
       })
       .then(messages => {
          const newMessages = messages.map(message => ({
                ...message,
                from:{
                    _id:message.from,
                 firstName: patientFrom.firstName,
                 lastName:patientFrom.lastName,
                 encounters:patientFrom.encounters   
                },
                to:{
                    _id:message.to,
                    firstName:doctorTo.firstName,
                    lastName:doctorTo.lastName,
                    cadre: doctorTo.cadre
                }
            }))
            return newMessages
       })
       .then(newMessages => {
            FromMessages =newMessages ;
           return MessageModel.find({from:to,to:from,fromType:'doctor'})
       })
       .then(messages => {
        const newMessages = messages.map(message => ({
            ...message,
            from:{
                _id:message.from,
             firstName: doctorTo.firstName,
             lastName:doctorTo.lastName,
             cadre:doctorTo.cadre, 
            },
            to:{
                _id:message.to,
                firstName:patientFrom.firstName,
                lastName:patientFrom.lastName,
                encounters:patientFrom.encounters
            }
        }))
        return newMessages
       })
       .then(newMessages =>{
         const allMessages = newMessages.concat(FromMessages);
            allMessages.sort((a,b) =>{
             return b.createdAt < a.createdAt ? 1 : -1
         })
         res.status(200).json({
             message:"Fetch successful!!!",
             messages: allMessages
         })
        
       })
   }
   


}

exports.changeMessageStatus = (req,res,next) => {
    //This values should be gotten from the message
    //that was sent on earlier time, since that is the message we're 
    //changing its status
    const {seen,fromId,toId,fromType} = req.body;
    const bolSeen = Boolean(seen);
    MessageModel.findOne({from:fromId,to:toId,fromType})
    .then(res => {
        if(!res){
            const error = new Error("This message did not come from me");
            error.statusCode = 401;
            throw error;
        }
        res.seen = bolSeen;
        return res.save()
    })
    .then(savedMessage => {
        res.status(200).json({
            message:'Message has been viewed',
            data: savedMessage
        })
    })
    .catch(err => next(err));
}

exports.getUserMessage = (req,res,next) => {
    //The same person owns the fromType and toId
    const {toId,fromType} = req.params;
    
    console.log(fromType)
    let myMessages =[];
    let person;
    //find the messages that are directed towards this user and have not been seen
    MessageModel.find({to:toId,seen:false})
    .then(messages => {
        if(!messages || messages.length === 0) {
            const err = new Error("You don't have active messages")
            err.statusCode = 302;
            throw err;
            
        }
        myMessages= messages;
        if(fromType === 'doctor'){
            return CadreModel.findById(messages[0].to)

        }    
        else{
            return PatientModel.findById(messages[0].to)
        }
    })
    .then(per => {
        person=per;
        if(fromType === 'doctor'){
            //In this case person is doctor
            return Promise.all(myMessages.map(message => {
                return PatientModel.findById(message.from)
            }))
            

        }  
        else {
            return Promise.all(myMessages.map(message => {
                return CadreModel.findById(message.from)
            }));
        }
    })
    .then(persons => {
        if(fromType === 'doctor'){
            //then here we know persons are patients;
            const populatedMessage = persons.map(patient => {
                return{
                    ...myMessages,
                    from:{
                        _id:patient._id,
                     firstName: patient.firstName,
                     lastName:patient.lastName, 
                     encounters:patient.encounters
                    },
                    to:{
                        _id:person._id,
                        firstName:person.firstName,
                        lastName:person.lastName,
                        cadre:person.cadre
                    }
                }
            })
            return populatedMessage;
        }
        else{
            //we know persons are doctor
            const populatedMessage = persons.map(doctor => {
                return{
                    ...myMessages,
                    from:{
                        _id:doctor._id,
                     firstName: doctor.firstName,
                     lastName:doctor.lastName, 
                     cadre: doctor.cadre
                    },
                    to:{
                        _id:person._id,
                        firstName:person.firstName,
                        lastName:person.lastName,
                        encounters:person.encounters
                    }
                    
                }
            })
            //This if else belock and commenting is done for clarity sake.
            return populatedMessage;
        }
    })
    .then(messages =>{
        console.log(messages)
        res.status(200).json({
            message:"Message gotten successfully!",
            messages: messages
        })
    })
    .catch(err => next(err))
}
