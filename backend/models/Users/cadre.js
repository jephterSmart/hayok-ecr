const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cadreSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required:true
    },
    age:{
        type: Number,
        required: true
    },
    cadre:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: 'male'
    },
    patients:[ {
        type: Schema.Types.ObjectId,
        ref: "Patient"
    }],
    notifications:[
        {
           from:{
               type: Schema.Types.ObjectId,
               ref: "Cadre"
           },
           patient:{
               type: Schema.Types.ObjectId,
               ref:"Patient"
           },
           seen:{
               type:Boolean,
               default:false
           },
           _id:{
               type: Schema.Types.ObjectId,
               default: new mongoose.Types.ObjectId()
           },
           timeReceived:{
               type: String,
               default: (new Date()).toString()
           }
        }
    ]
})

module.exports = mongoose.model('Cadre',cadreSchema);