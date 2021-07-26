import {useState,useEffect,useRef} from 'react';

//stores
import {useAuthStore} from '../../../store/authStore';
import {useMessageStore,UPDATE_STATUS,useMessageDispatch} from '../../../store/messageStore';

import {fetchPatients,getUserData,getMessages,sendMessage,changeMessageStatus} from '../../../utils/patientsHelper';

import classes from './messages.module.css';
import Select from '../../UI/Select';
import Input from '../../UI/Input';
import Button from '../../UI/Button';
import Popup from '../../UI/Popup';
import Loading from '../../UI/Spinner/loading';

const convertToCap = letter => {
    return letter[0].toUpperCase() + letter.substring(1);
} 
const createOption = (pat) => ({value:pat._id,displayValue: convertToCap(pat.firstName) + ' '+ convertToCap(pat.lastName)});

const createDoctorOption = encounter => ({
    value:encounter.cadre._id, displayValue: `${convertToCap(encounter.cadre.cadre)} ${convertToCap(encounter.cadre.firstName)}
        ${convertToCap(encounter.cadre.lastName)}`
})
const MessagesPage = () => {
    const [list,setList] = useState([]);
    const {userType,token,userId} = useAuthStore();
    const [currentPage,setCurrentPage] = useState(1);
    const [error,setError] = useState('');
    const MessageRef = useRef();

    useEffect(() => {
        if(userType === 'doctor'){
            fetchPatients(token,30,currentPage)
            .then(data => {
                setError('');
                setCurrentPage(1);
                setList(data.patients);
            })
            .catch(err =>{
                setError(err.message || 'could not fetch Messages')
            })
        }
        else{
            getUserData(token)
            .then(data =>{
                setList(data.encounters)
                setError('');

            })
            .catch(err =>{
                setError(err.message || 'Try reload the page')
            })
        }
    },[]);
    let options = [];
    if(userType === 'doctor'){
         options = list.map(createOption)
         options.unshift({value:'',displayValue:'Select Patient to chat with'})
    }
    else{
        options = list.map(createDoctorOption);
        options.unshift({value:'',displayValue:'Select Doctor to chat with'})
    }
    
    
    const [messages,setMessages] = useState([]); 
    const [toPerson,setToPerson] = useState('')
    const SelectHandler = ({target:{value}}) => {
        //The value should be the userId of the patient
        setToPerson(value);
        getMessages(token,userId,value,userType)
        .then(messages =>{
            setError('')
            setMessages(messages);
            MessageRef.current.scrollIntoView()
        })
        .catch(err => {
            setError(err.message || 'Can not get messages')
        })

    }
    const [loading,setLoading] = useState(false);
    const InputRef = useRef();

    
    const MessageSendHandler = () => {
            setLoading(true);
            sendMessage(token,userId,toPerson,userType,InputRef.current.value)
            .then(res => {
                setMessages(messages => {
                    const newMessages = [...messages,res];
                    return newMessages
                })
                setLoading(false);
                setError('');
                InputRef.current.value = '';
                MessageRef.current.scrollIntoView();
            })
            .catch(err => {
                setLoading(false);
                setError(err.message || 'Could not send message')
            })
    }
    //check for new messages
    const newMessages = useMessageStore();
    const messageDispatch = useMessageDispatch()
    useEffect(()=>{
        //Avoid doing this when page first loads.
        if(newMessages.length > 0){
           //if message from that person
            let message = newMessages.find(message => message.from._id.toString() === toPerson.toString() &&
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
                        messageId:message._id
                    });
                    MessageRef.current.scrollIntoView();
                })
                .catch(err => {
                    setError(err.message || "Check your Internet Connection")
                })
                
            }
            
            
        }
       
    },[newMessages])
   
    return(
        <div className={classes.Messages}>
            <h1>Messaging</h1>
            {error && <Popup time={5000} danger>{error}</Popup>}
            {userType==='doctor'?(
                <div>
                    <Select options={options} Label='Select Patient to chat with:'
                    onChange={SelectHandler} value={toPerson}/>
                    <div className={classes.MessageArea}>{
                        messages.map((message,idx,arr) => {
                            if(message.from._id.toString() === userId.toString())
                            return (<div className={classes.Grid+' '+ classes.You} key={message._id}
                            ref={idx===arr.length-1 ? MessageRef: {current:' '}} >

                                <p>You : <br /> {message.message}</p>
                                <p>{message.createdAt}</p>
                            </div>)
                            if(message.to._id.toString() === userId.toString()){
                                return(<div className={classes.Grid + ' '+ classes.Person} key={message._id}
                                ref={idx===arr.length-1 ? MessageRef: {current:' '}} >
                                    <p>{`${convertToCap(message.from.firstName)}  ${convertToCap(message.from.lastName)} :`}
                                    <br/> {message.message}</p>
                                    <p>{message.createdAt}</p>
                                </div>)
                            }
                        })
                    }
                       
                    </div>
                    <div className={classes.MessageAction}>
                            <Input ref={InputRef} label="Type message to send" textArea rows={3} placeholder="Send Message to Patient "/>
                            <Button disabled={loading} filled raised
                            onClick={MessageSendHandler}>Send <Loading loading={loading}/></Button>
                    </div>
                </div>
            ):(<div>
                   <Select options={options} Label='Select Employee to chat with:'
                    onChange={SelectHandler} value={toPerson} /> 
                     <div className={classes.MessageArea}>{
                        messages.map((message,idx,arr) => {
                            if(message.from._id.toString() === userId.toString())
                            return (<div className={classes.Grid + ' '+classes.You} key={message._id}
                            ref={idx===arr.length-1 ? MessageRef: {current:' '}} >
                                <p>You : <br /> {message.message}</p>
                                <p>{message.createdAt}</p>
                            </div>)
                            if(message.to._id.toString() === userId.toString()){
                                return(<div className={classes.Grid + '  '+ classes.Person} key={message._id}
                                ref={idx===arr.length-1 ? MessageRef: {current:' '}} >
                                    <p>{`${convertToCap(message.from.firstName)}  ${convertToCap(message.from.lastName)} :`}
                                    <br/> {message.message}</p>
                                    <p>{message.createdAt}</p>
                                </div>)
                            }
                        })
                    }
                    
                    </div>
                    <div className={classes.MessageAction}>
                            <Input ref={InputRef} label="Type message to send" textArea rows={3} placeholder="Send Message to Doctor "/>
                            <Button disabled={loading} filled raised
                            onClick={MessageSendHandler}>Send <Loading loading={loading}/></Button>
                        </div>
                </div>)}
        </div>
    )
}

export default MessagesPage