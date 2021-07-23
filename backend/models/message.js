const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        required:true
    },
    to:{
        type: Schema.Types.ObjectId,
        required:true
    },
    message: String,
    fromType: String,
    seen: {
        type:Boolean,
        default: false
    }
    
    
},{timestamps:true})

module.exports = mongoose.model('Message',messageSchema);