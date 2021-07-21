import { useState } from 'react';
import {Link, useHistory} from 'react-router-dom';

import {updateNotification} from '../../../utils/patientsHelper';

import {useAuthStore}  from '../../../store/authStore';
import Popup from '../Popup';
import classes from './notification.module.css';


const NotificationCard = ({notification}) => {
    const {token,userId} = useAuthStore();

    const [error,setError] = useState({error:false,message:''})

    const history = useHistory();

    const updateHandler = () => {
        updateNotification(token,true,notification._id)
        .then(({notifications}) => {
            console.log(notifications);
            history.push(`/user/${userId}/${notification._id}`)
        })
        .catch(err => {
            setError({error:true,message:err.message || 'Could not fetch'})
        })
    }
    const names = [classes.Notification];
    if(notification.seen) names.push(classes.Seen)
    return(
        <>
        {error.error && <Popup danger>{error.message}</Popup>}
        <div onClick={updateHandler} className={names.join(' ')}>
            {/* <Link to={`/user/${userId}/${notification._id}`}>

            </Link> */}
            <div className={classes.From}>
                <p className={classes.Header}>From:</p>
                <p className={classes.FirstName}>{`${notification.from.cadre}  ${notification.from.firstName}`}</p>
                <p className={classes.LastName}>{notification.from.lastName}</p>

            </div>
            <div className={classes.Patient}>
                <p className={classes.Header}>About Patient:</p>
                <p className={classes.FirstName}>{notification.patient.firstName}</p>
                <p className={classes.LastName}>{notification.patient.lastName}</p>
            </div>
            <div className={classes.Time}>{new Date(notification.timeReceived).toString()}</div>
            
        </div>
        </>
    )
}
export default NotificationCard;