const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required:true
    },
    age:{
        type: Date,
        required: true
    },
    height:{
        type: Number,
        required: true
    },
    weight:{
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    ward:{
        type:String,
        default:'05a'

    },
    lga:{
        type: String,
        default: 'Ojo'
    },
    state:{
        type: String,
        default: 'Lagos'
    },
    imageUrl:{
        type:String,
        required: true
    },
    bmi:{
        type:Number,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "Cadre"
    },
    encounters:[{
        dateOfEncounters: [{
            type:String,
            required: true}],
        timeOfEncounters: [{
            type:String,
            required: true}],
        cadre: {
            type: Schema.Types.ObjectId,
            ref: "Cadre"
        },
        numberOfEncounter: {
            type: Number,
            default: 0
        }
        
    }],
    bloodPressure: String,
    temperature: Number,
    respiratoryRate: String,
    complaints:String,
    treatmentPlan:String,
    diagnosis: String,
    logInTime:String,
    
},{timestamps:true})

module.exports = mongoose.model('Patient',patientSchema);