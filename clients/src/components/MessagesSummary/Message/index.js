
import classes from './message.module.css';


import personImage from '../../../images/profile.jpg';


const Person = ({name,active}) => {
    
    return (
        <div className={classes.Image}>
            <img src={personImage} alt={`user- ${name}`} />
            <div className={`${classes.Badge} ${active? classes.Active : ' '}`}></div>
            <div></div>
        </div>
    )
}
const Message = ({name,active,lastMessage,lastVisited}) => {
   
    return (
        <>
            <div className={classes.ListItem}>
                <div>
                    <Person name={name} active={active}/>
                </div>
                <div className={classes.Text}>
                    <strong>{name}</strong>
                    <p>{lastMessage}</p>
                </div>
                <div>{lastVisited}</div>
            </div>
            
        </>
    );
} 

export default Message;