const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('./socket');


//routes to go into
const authRoute = require('./routes/auth');
const patientRoute = require('./routes/patient');
const cadreRoute = require('./routes/cadre');
const messageRoute = require('./routes/message');

const app = express();


app.use(cors());

//These are my custom headers
app.use((req,res,next) => {
            res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization, PerPage, CurrentPage')//which headers will be used to access my resources
            next();
      
})
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));



//make path publicly available
app.use('/images',express.static(path.join(__dirname,'images')));

//any route that start with /auth should go into this route
app.use('/auth',authRoute);
//any route that begins with /user should go into this route
app.use('/user',patientRoute);
//any route that begins with /employess should go into route
app.use('/employees',cadreRoute);

//any route that deals with message goes into here
app.use('/info',messageRoute);

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
socket.init(server)

    })
.catch(err =>{
    throw err
    
})

