import {useState} from 'react';
import {Link} from 'react-router-dom';

import {  KeyboardArrowDown, KeyboardArrowUp, Search, Sort } from '../Icons';
import Button from '../UI/Button'
import Input from '../UI/Input'
import Badge from '../UI/Badge'
import Message from './Message';


import personImage from '../../images/profile.jpg';

import {useMessageStore} from '../../store/messageStore';
import {useAuthStore} from '../../store/authStore';

import classes from './messages.module.css';

    
const Collapse = ({in:ini,children,className='',...rest}) => {
    
    const names = [classes.CollapseRoot];
    if(className) names.push(className);

    if(ini) return <div {...rest} className={names.join(' ')}>{children}</div>;
    else return <div className={names.join(' ')} {...rest}>{null}</div> 
}
const convertToCap = letter => {
    return letter[0].toUpperCase() + letter.substring(1);
}
const Messages = () => {
    
    const [open,setOpen] = useState(false);

    const {token,userId} = useAuthStore();
    const messageStore = useMessageStore();
    const messageNotSeen = messageStore.reduce((acc,ele) => {
        if(ele.seen === false) return acc+1;
        else return acc;
    },0);
    
    return (
       <div className={classes.Root}>
           <div className={`${classes.Message} ${open ? classes.Open : ' '}`}>
              <div className={classes.Left}>
                    <div className={classes.Image}>
                            <img src={personImage} alt='user' />
                            <div></div>
                    </div>
                    <Badge content={messageNotSeen} hide={messageNotSeen === 0}><strong>New Messages</strong></Badge>
               </div>
               <div>
                    
                    <Button className={classes.Btn} onClick={() => setOpen(prev => !prev)}>
                        {open ?<KeyboardArrowDown /> : <KeyboardArrowUp />}
                    </Button>
               </div>
           </div>
           
           <Collapse in={open} >
                
                <div className={classes.Collapse}>
                    <div className={classes.Adornment}>
                        <div className={classes.Start}><Search /></div>
                        <Input placeholder="Search messages" type='search'
                        className={classes.Textfield}
                        />
                        <div className={classes.End}> <Sort /></div>
                    </div>
                   
                </div>
                <div className={classes.List}>
                        {messageStore.map(message => {
                            if(userId.toString() === message.from._id.toString()){
                                return(
                                    <Link key={message._id} className={classes.Link} to={`/user/message/${message.to._id}`}>
                                    <Message  name={`${convertToCap(message.to.firstName)} ${convertToCap(message.to.lastName)}`} 
                                    active ={message.to.active}
                                    lastMessage={`You: ${message.message}`} lastVisited ={message.createdAt}/>
                                    </Link>
                                )
                            }
                            else{
                                return(
                                    <Link key={message._id} className={classes.Link}  to={`/user/message/${message.from._id}`}>
                                    <Message name={`${convertToCap(message.from.firstName)}  ${convertToCap(message.from.lastName)}`} 
                                    active={message.from.active} key={message._id}
                                lastMessage={`${convertToCap(message.from.firstName)}  ${convertToCap(message.from.lastName)}: ${message.message}`} 
                                lastVisited ={message.createdAt}/>
                                </Link>
                            
                                )
                            }
                            
                        })}
                    </div>
           </Collapse>
           
       </div>
    )
}

export default Messages;