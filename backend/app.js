const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use((error,req,res,next) =>{
    const message = error.message;
    const status = error.statusCode || 500;
    console.log(error);
    res.status(status).json({
        message: message,
        error:error.errors
    });
})

mongoose.connect(process.env.MONGO_URI,
{useNewUrlParser: true,useUnifiedTopology: true})
.then(result => {
   console.log(result);
server = app.listen(process.env.PORT || 8080)
// socket.init(server)

    })
.catch(err =>{
    throw err
    
})

