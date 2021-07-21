import { useState,useEffect, useRef } from 'react';

import Button from '../../UI/Button';
import Input from '../../UI/Input';
import Select from '../../UI/Select'
import Loading from '../../UI/Spinner/loading';

import { getAllCadre, updateCadreAndPatientInfo } from '../../../utils/patientsHelper';
import { useAuthStore} from '../../../store/authStore'

import classes from './doctor-select.module.css';

const createOption = (doctor) => {
    return(
    {value:`${doctor._id}`,displayValue:`${doctor.cadre} ${doctor.firstName} ${doctor.lastName}`})
}
const DoctorSelect = ({onSelect=()=>{},patientId}) => {
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('');
    const [doctors,setDoctors] = useState([])

    //custom store;
    const authStore = useAuthStore();

    useEffect(()=>{
        setLoading(true);
        getAllCadre(authStore.token,authStore.userId)
        .then(doctors => {
            setDoctors(doctors);
            setLoading(false);
            setError('');
        })
        .catch(err =>{
            setError(err.message);
            setLoading(false);
        })
    },[]);
    const SelectRef = useRef();

    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        const value = SelectRef.current.value;
        console.log(value);
        updateCadreAndPatientInfo(authStore.token,authStore.userId,value,patientId)
        .then(data => {
            console.log(data);
            onSelect(null, data);
            setLoading(false);
            setError('');
            
        })
        .catch(err => {
            setError(err.message)
            setLoading(false);
            onSelect(err,null);
        })
       
    }
    const doctorOptions = doctors.map(createOption);
    return(
        <form className={classes.DoctorSelect} onSubmit={submitHandler}>
            {error !== ''? <Input value={error} disabled /> :(
                <Select Label="Send Patient's File To:"
                options={doctorOptions} ref={SelectRef}  className={classes.Select}/>
            )}
                        
            <Button disabled={loading || error !== '' } filled raised type='submit'
            className={classes.Btn}>Send <Loading loading={loading} 
            /></Button>
        </form>
    )
}

export default DoctorSelect