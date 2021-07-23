import {useState} from 'react';


import {  KeyboardArrowDown, KeyboardArrowUp, Search, Sort } from '../Icons';
import Button from '../UI/Button'
import Input from '../UI/Input'
import Message from './Message';

import personImage from '../../images/profile.jpg';

import classes from './messages.module.css';

    
const Collapse = ({in:ini,children,className='',...rest}) => {
    
    const names = [classes.CollapseRoot];
    if(className) names.push(className);

    if(ini) return <div {...rest} className={names.join(' ')}>{children}</div>;
    else return <div className={names.join(' ')} {...rest}>{null}</div> 
}

const Messages = () => {
    
    const [open,setOpen] = useState(false)
    
    return (
       <div className={classes.Root}>
           <div className={`${classes.Message} ${open ? classes.Open : ' '}`}>
              <div className={classes.Left}>
                    <div className={classes.Image}>
                            <img src={personImage} alt='user' />
                            <div></div>
                    </div>
                    <strong>Messaging</strong>
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
                        <Message name="Frank Ojiako" active 
                        lastMessage="You: You're Welcome" lastVisited ="Jun 9"/>
                        <Message name="Chris nwasiwe" active 
                        lastMessage="chris: sure man!!!" lastVisited ="Jun 8"/>
                        <Message name="Ibiniye Obikoya"  
                        lastMessage="You: You're Welcome" lastVisited ="Jun 6"/>
                        <Message name="Frank Ojiako" active 
                        lastMessage="You: You're Welcome" lastVisited ="Jun 9"/>
                        <Message name="Frank Ojiako" 
                        lastMessage="You: You're Welcome" lastVisited ="Jun 2"/>
                        <Message name="Frank Ojiako" active 
                        lastMessage="You: You're Welcome" lastVisited ="Jan 9"/>
                        <Message name="Frank Ojiako"  
                        lastMessage="You: You're Welcome" lastVisited ="Mar 9"/>
                        <Message name="Frank Ojiako"  
                        lastMessage="You: You're Welcome" lastVisited ="Mar 9"/>
                        
                    </div>
           </Collapse>
           
       </div>
    )
}

export default Messages;