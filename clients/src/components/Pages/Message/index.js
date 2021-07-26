import {useParams} from 'react-router-dom';
import {useState,useEffect,useRef} from 'react';

import {sendMessage, getMessages,changeMessageStatus} from '../../../utils/patientsHelper';
import {useAuthStore} from '../../../store/authStore';
import {useMessageStore,useMessageDispatch,UPDATE_STATUS} from '../../../store/messageStore';

import Input from '../../UI/Input';
import Button from '../../UI/Button';
import Popup from '../../UI/Popup';
import Loading from '../../UI/Spinner/loading';

import classes from './message.module.css';

const convertToCap = letter => {
    return letter[0].toUpperCase() + letter.substring(1);
}
const Message = () => {
    const {toId} = useParams();
    const {token,userId,userType} = useAuthStore();
    const [messages,setMessages] = useState([]);
    const [error,setError] = useState();
    const [loading,setLoading] = useState(false);
    const InputRef = useRef();
    const MessageRef = useRef(); 

    const newMessages = useMessageStore();
    const messageDispatch = useMessageDispatch()
    
    const submitHandler = () => {
        
            setLoading(true);
            sendMessage(token,userId,toId,userType,InputRef.current.value)
            .then(res => {
                setMessages(messages => {
                    const newMessages = [...messages,res];
                    return newMessages
                })
                setLoading(false);
                setError('');
                InputRef.current.value = '';
                MessageRef.current.scrollIntoView()
            })
            .catch(err => {
                setLoading(false);
                setError(err.message || 'Could not send message')
            })
    
    }
    useEffect(()=>{
        setLoading(true);
        let fromType;
        if(userType === 'doctor') fromType ='patient';
        else fromType='doctor';
        getMessages(token,userId,toId,userType)
        .then(messages =>{
            setError('')
            setMessages(messages);
            setLoading(false);
           
        })
        .catch(err => {
            setLoading(false);
            setError(err.message || 'Can not get messages')
        })
        let message = newMessages.find(message => message.from._id.toString() === toId.toString() &&
        message.seen === false)
        if(message && !Boolean(message.seen)){
        changeMessageStatus (token,toId,userId,fromType,true)
        .then(updatedMessage => {
            setError('');
            messageDispatch({
                type:UPDATE_STATUS,
                seen:true,
                messageId:message._id
            });
            MessageRef.current.scrollIntoView()
        })
        .catch(err => {
            setError(err.message || 'can not update messages')
        })
    }

    },[])
    //for handling messages
    
    useEffect(()=>{
        //Avoid doing this when page first loads.
        if(newMessages.length > 0){
            let message = newMessages.find(message => message.from._id.toString() === toId.toString() &&
            message.seen === false)
            //An extra level of protection to ensure that we're checking only for 
            //messages that are not seen
            if(message && !Boolean(message.seen)){
                setMessages(messages => {
                            const newMessages = [...messages,message];
                            return newMessages;
                        });
                changeMessageStatus (token,message.from._id,message.to._id,message.fromType,true)
                .then(changedMessage => {
                    
                    setError('')
                    messageDispatch({
                        type:UPDATE_STATUS,
                        seen:true,
                        messageId: message._id
                    });
                    MessageRef.current.scrollIntoView()
                })
                .catch(err => {
                    setError(err.message || "Check your Internet Connection")
                })
                
            }
            
            
        }
       
    },[newMessages])
    return(
        <div className={classes.Message}>
                        <h1>Messaging</h1>
            {error && <Popup time={5000} danger>{error}</Popup>}
            <div className={classes.MessageArea}>{
            messages.map((message,idx,arr )=> {
                            if(message.from._id.toString() === userId.toString())
                            return (<div className={classes.Grid+' '+ classes.You} key={message._id}
                            ref={idx===arr.length-1 ? MessageRef: {current:' '}} >
                                <p>You : <br /> {message.message}</p>
                                <p>{message.createdAt}</p>
                            </div>)
                            if(message.to._id.toString() === userId.toString()){
                                return(<div className={classes.Grid + ' '+ classes.Person} key={message._id}
                                ref={idx===arr.length-1 ? MessageRef: {current:' '}}>
                                    <p>{`${convertToCap(message.from.firstName)}  ${convertToCap(message.from.lastName)} :`}
                                    <br/> {message.message}</p>
                                    <p>{message.createdAt}</p>
                                </div>)
                            }
                        })
                    }
                       
            </div>
            <Input textArea ref={InputRef} />
            <Button raised filled disabled={loading}
            onClick ={submitHandler}>Send<Loading loading={loading} /></Button>
        </div>
    )
}
export default Message;