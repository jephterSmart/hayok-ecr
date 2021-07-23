const express = require('express');


const messageController = require('../controllers/message')

const isAuth = require('../middleware/isAuth');

const router = express.Router();

//get => /info/messages/:toId
router.get('/messages/:toId/:fromType',isAuth,messageController.getUserMessage);


//get => /info/message/:from/:to/:usertype
router.get('/message/:from/:to/:usertype',isAuth,messageController.getMessages);



//Patch message status
router.patch('/message',isAuth,messageController.changeMessageStatus);
//Post=> /info/message
router.post('/message',isAuth,messageController.postMessage);

module.exports = router;