import {useHistory} from 'react-router-dom';
import {useEffect,useState} from 'react';


import {useAuthStore} from '../../../store/authStore';

import Button from '../../UI/Button';

import classes from './record.module.css';

const RecordPage = () =>{
    const {profile,error :errorState} = useAuthStore();
    const history = useHistory();
    
    
  
       
   const chatHandler = (staffId) => {
        return (e) => {
            //coming back to this
            history.push(`/user/message/${staffId}`)
        }
   }
    
    return(
        <div className={classes.Record}>
            {!errorState ?(
            <>
            <h1>Your Full Details</h1>
            
            
            <div className={classes.Img}>
                <img src={"http://localhost:8080/" + profile.imageUrl} />
            </div>
            <div className={classes.Grid}>
                <div>
                    <p><strong>First Name:</strong> {profile.firstName}</p>
                    <p><strong>Surname:</strong> {profile.lastName}</p>
                    <p><strong>Date of Birth:</strong> {profile.age}</p>
                    <p><strong>Height (in meters):</strong> {profile.height}</p>
                    <p><strong>Weight (in Kg):</strong> {profile.weight}</p>
                    <p><strong>Gender:</strong> {profile.gender}</p>
                    <p><strong>Ward:</strong> {profile.ward}</p>
                    <p><strong>Local Government Area (LGA):</strong> {profile.lga}</p>
                    <p><strong>State:</strong> {profile.state}</p>
                </div>
                <div>
                    <p><strong>Body Mass Index (BMI):</strong> {profile.bmi}</p>
                    <p><strong>Blood Pressure (BP):</strong> {profile.bloodPressure}</p>
                    <p><strong>Temperature (in degree celcuis):</strong> {profile.temperature}</p>
                    <p><strong>Respiratory Rate (RR):</strong> {profile.respiratoryRate}</p>
                    <p><strong> Complaints Made :</strong> {profile. complaints}</p>
                    <p><strong> Suggested Treatment Plan :</strong> {profile. treatmentPlan}</p>
                    <p><strong> Diagnosis Result :</strong> {profile.diagnosis}</p>
                </div>
            
            </div>
            <div className={classes.Encounters}>
                {
                    profile.encounters && profile.encounters.length> 0 &&(
                        <>
                        <h3>This Staff are Looking into your case</h3>
                        <ul className={classes.Cadres}>
                            {profile.encounters.map(ele => <li key={ele.cadre._id} className={classes.Cadre}>
                                <strong>{`${ele.cadre.cadre} ${ele.cadre.firstName} ${ele.cadre.lastName}`}</strong>
                                <Button filled raised onClick={chatHandler(ele.cadre._id)}>Talk to {`${ele.cadre.cadre} ${ele.cadre.firstName} ${ele.cadre.lastName}`}</Button>
                            </li>)}
                        </ul>
                        </>
                    )
                }
            </div>
            </>) : <p className={classes.Error}>{errorState.message} <strong>Try and reload the page</strong></p>
            }
        </div>
    )
}
export default RecordPage;