const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//routes to go into
const authRoute = require('./routes/auth')
const app = express();

app.use(cors());
app.use(bodyParser.json());

//any route that start with /auth should go into this route
app.use('/auth',authRoute);

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
   console.log('Connected to mongoDb');
server = app.listen(process.env.PORT || 8080)
// socket.init(server)

    })
.catch(err =>{
    throw err
    
})

