import {useParams} from 'react-router-dom';
import {useEffect} from 'react';

import {useAuthDispatch,UPDATE_NOTIFICATION,useAuthStore} from '../../../store/authStore';

import classes from './notification.module.css';

const NotificationPage = () =>{
    const dispatch = useAuthDispatch();
    const {notifications} = useAuthStore();

    const {notificationId} = useParams();
    useEffect(() => {
        dispatch({
            type:UPDATE_NOTIFICATION,
            notificationId 
        })
    },[])
    const notification = notifications.find(ele => ele._id.toString() === notificationId.toString())
    return(
        <div className={classes.Notification}>
            {notification ?(
            <>
            <h1>Full details about the Notification Received</h1>
            
            <p className={classes.Doctor}>{`${notification.from.cadre} ${notification.from.firstName} ${notification.from.lastName}`} sent
            you a patient file. The following information is what was left about the patient. </p>
            <div className={classes.Img}>
                <img src={'http://localhost:8080/'+notification.patient.imageUrl} />
            </div>
            <div className={classes.Grid}>
                <div>
                    <p><strong>First Name:</strong> {notification.patient.firstName}</p>
                    <p><strong>Surname:</strong> {notification.patient.lastName}</p>
                    <p><strong>Date of Birth:</strong> {notification.patient.age}</p>
                    <p><strong>Height (in meters):</strong> {notification.patient.height}</p>
                    <p><strong>Weight (in Kg):</strong> {notification.patient.weight}</p>
                    <p><strong>Gender:</strong> {notification.patient.gender}</p>
                    <p><strong>Ward:</strong> {notification.patient.ward}</p>
                    <p><strong>Local Government Area (LGA):</strong> {notification.patient.lga}</p>
                    <p><strong>State:</strong> {notification.patient.state}</p>
                </div>
                <div>
                    <p><strong>Body Mass Index (BMI):</strong> {notification.patient.bmi}</p>
                    <p><strong>Blood Pressure (BP):</strong> {notification.patient.bloodPressure}</p>
                    <p><strong>Temperature (in degree celcuis):</strong> {notification.patient.temperature}</p>
                    <p><strong>Respiratory Rate (RR):</strong> {notification.patient.respiratoryRate}</p>
                    <p><strong> Complaints Made :</strong> {notification.patient. complaints}</p>
                    <p><strong> Suggested Treatment Plan :</strong> {notification.patient. treatmentPlan}</p>
                    <p><strong> Diagnosis Result :</strong> {notification.patient.diagnosis}</p>
                </div>
            
            </div>
            </>) : <p>No Notification with that Id</p>
            }
        </div>
    )
}
export default NotificationPage;