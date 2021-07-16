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
        default:'0'

    },
    lga:{
        type: String,
        required:true
    },
    state:{
        type: String,
        required:true
    },
    picture:{
        type:String
    },

    patients:[ {
        type: Schema.Types.ObjectId,
        ref: "Doctor"
    }]
})

module.exports = mongoose.model('Patient',patientSchema);