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
        type: Number,
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
    picture:{
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
    }
},{timestamps:true})

module.exports = mongoose.model('Patient',patientSchema);