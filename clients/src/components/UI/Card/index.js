
import { useState } from 'react';
import {useHistory} from 'react-router-dom';

import Button from '../Button';
import Modal from '../Modal';
import classes from './card.module.css';


const Card = ({data}) => {
    const history = useHistory();
    const [open,setOpen] = useState(false);
    const closeHandler = (e) => {
        setOpen(false);
    }
    const onEncounter = () => {
        history.push(`/user/patients/${data._id}`)
    }
    
    let time = new Date(data.updatedAt).toLocaleString();
    if(new Date(data.logInTime) >= new Date(data.updatedAt))
    time= new Date(data.logInTime).toLocaleString();
    const url = 'http://localhost:8080/';
    return(
        <>
        <div className={classes.Card} onClick={()=>{setOpen(true)}}>
            <div className={classes.Left}>
                <div className={classes.Img}>
                    <img src={url + data.imageUrl} alt={`Capture of ${data.firstName}- ${data.lastName}`} />
                </div>
                <div className={classes.Data}>
                    <p>{data.firstName}</p>
                    <p>{data.lastName}</p>
                </div>
            </div>
            <div className={classes.Right}>
            <p >Last time active:<br /> <strong>{time}</strong></p>
            <Button className={classes.btn} onClick={onEncounter}>Encounter</Button>
            </div>
        </div>
        <Modal openModal={open} onClose={closeHandler} onEncounter={onEncounter}>
            <div className={classes.ModalItem}>
                <div className={classes.ModalImg}>
                    <img className={classes.Image} 
                    src={url+ data.imageUrl} alt={`Capture of ${data.firstName}- ${data.lastName}`}/>
                </div>
                <p><strong>First Name:</strong><span>{data.firstName}</span></p>
                <p><strong>Surname:</strong><span>{data.lastName}</span></p>
                <p><strong>Age:</strong><span>{new Date().getFullYear() - new Date(data.age).getFullYear() } Years</span></p>
                <p><strong>Gender:</strong><span>{data.gender}</span></p>
                <p><strong>Weight (in Kg):</strong><span>{data.weight}</span></p>
                <p><strong>Height (in meters):</strong><span>{data.height}</span></p>
                <p><strong>BMI:</strong><span>{data.bmi}</span></p>
                <p><strong>Ward:</strong><span>{data.ward}</span></p>
                <p><strong>Local Government Area (LGA):</strong><span>{data.lga}</span></p>
                <p><strong>State:</strong><span>{data.state}</span></p>
                <p><strong>Country:</strong><span>Nigeria</span></p>
            </div>
        </Modal>
        </>
    )
}

export default Card;
