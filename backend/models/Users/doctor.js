const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
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
    }]
})

module.exports = mongoose.model('Doctor',doctorSchema);