import {useHistory, useParams} from 'react-router-dom';
import {useState,useRef} from 'react';

import {updatePatientInfo} from '../../../utils/patientsHelper'

import classes from './encounter.module.css';
import Input from '../../UI/Input';
import Popup from '../../UI/Popup';
import Select from '../../UI/Select';
import Button from '../../UI/Button';
import Loading from '../../UI/Spinner/loading';


import DoctorSelect from './doctorSelect';
import { useAuthStore } from '../../../store/authStore';


const initialData = {
    dateOfEncounter:'',
    timeOfEncounter:'',
    visits:'firstTime',
    height:0,
    weight:0,
    bloodPressure: '',
    temperature:36.5,
    respiratoryRate: '',
    diagnosis: 'others',
}


const EncounterPatient = () => {
    const {patientId} = useParams();
    const history = useHistory();

    const authStore = useAuthStore();
    //for handling complains and treatment
    const complaintRef = useRef();
    const treatmentRef = useRef();

    const [formData,setFormData] = useState(initialData);
    const [formError,setFormError] = useState({});
    const [message,setMessage] = useState('');
    const [loading,setLoading] = useState();
   // const [touched,setTouched] = useState(false);
    const [time, setTime] = useState(2000);
    const [error,setError] = useState(false)
    
    const changeHandler = e => {
        let ele = e.target;
        
        //setTouched(true);
        setFormData(formdata => {
            return{...formdata,[ele.name] : ele.value}
        })
        if(ele.type === 'text'){
            if(ele.value.trim().length < 3){
                setFormError(formerror => {
                    return{...formerror, [ele.name]: "character length must be more than 3"}
                })
                return;
            }
            else{
                setFormError(formerror => {
                    return{...formerror, [ele.name]: ""}
                }) 
            }
        }
    
    }
    const checkFormError = (formError,formData) => {
        const errors = Object.values(formError).reduce((acc,err) => {
            //if(err === undefined) return acc+ "undefined";
            return acc+err;
        },"")
        const res = Object.values(formData).some(ele => ele === "" );
        
        return  res || errors.length > 1;
    }
    const submitHandler = e => {
        e.preventDefault();
        const complaint = complaintRef.current.value;
        const treatment = treatmentRef.current.value
        setLoading(true);
        const sentData = {...formData,[complaintRef.current.name]:complaint,
        [treatmentRef.current.name] : treatment}
        
        updatePatientInfo(authStore.token,patientId,sentData)
        .then(updatedData => {
            setLoading(false);
            console.log(updatedData)
            setMessage("Details has been saved")
            history.push('/user/all-patients') ;
                   
        })
        .catch(err => {
            setLoading(false)
            setMessage(err.message || 'Data could not store, Check network and try again');
            setError(true);
        })        
    }
    const doctorSelectHandler = (err,data) => {
        if(err){
            setError(true);
            setMessage(err.message || 'Try again. Patient has not been sent to another doctor');
            
        }
        if(data){
            console.log(data);
            setError(false);
            setMessage(data.message || "Data has been forwarded to ");
        }

    }

    
    return(
        <div className={classes.Encounter}>
            {
                message !== '' && <Popup danger={error} time={time}
                onClick={() => setTime(0)}>{message}</Popup>
            }
            
            <h1>Encounter Process</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.Grid}>
                    <Input type='date' label='Date:' name='dateOfEncounter' required
                    errormessage={formError.dateOfEncounter} onChange={changeHandler} value={formData.dateOfEncounter}/>
                    <Input errormessage={formError.timeOfEncounter} onChange={changeHandler} value={formData.timeOfEncounter}
                     type='time' label='Time:' name='timeOfEncounter' required/>
                </div>
                <div className={classes.Grid}>
                    <Select Label='Visits:'  name='visits' onChange={changeHandler}
                     value={formData.visits} className={classes.Select}
                    options={[{value:'firstTime',displayValue:'First Time'}, 
                    {value:'repeat',displayValue: 'Repeat'}]}  className={classes.Select}/>
                    <Input errormessage={formError.weight} onChange={changeHandler} value={formData.weight}
                     name='weight' label='Weight (in Kg):'  type='number' step="0.5"required/>
                </div>
                <div className={classes.Grid}>
                    <Input errormessage={formError.height} onChange={changeHandler} value={formData.height}
                     name='height' label='Height (in meters):' type='number' required />
                    <Input label='BMI' disabled 
                    value={`${(formData.weight && formData.height) ? 
                        +formData.weight/(Number(formData.height) ** 2): ' ' }`} />
                </div>
                <div className={classes.Grid}>
                    <Input errormessage={formError.bloodPressure} onChange={changeHandler} value={formData.bloodPressure}
                     name='bloodPressure' label='Blood Pressure (BP):' type='number'
                    />
                    <Input errormessage={formError.temperature} onChange={changeHandler} value={formData.temperature}
                     name='temperature' label='Temperature' type='number'
                    steps='0.1' />
                    <Input errormessage={formError.respiratoryRate} onChange={changeHandler} value={formData.respiratoryRate}
                     name='respiratoryRate' label='Respiratory Rate (RR):' type='number' />
                </div>
                <div className={classes.Grid}>
                    <Input ref={complaintRef} className={classes.Special}
                     textArea rows='5' name='complaints' label='Complaints Box' />
                </div>
                <div className={classes.Grid}>
                    <Select name='diagnosis' Label='Diagnosis :' 
                        errormessage={formError.respiratoryRate} onChange={changeHandler} value={formData.respiratoryRate}
                        options={[{value:'hyperTension',displayValue:'HyperTension'},
                        {value:'pneumonia',displayValue:'Pneumonia'},{displayValue:'Malaria',value:'malaria'},
                        {value:'diabetes',displayValue:'Diabetes :'},{value:'others',displayValue:'Others'}]}
                        className={classes.Select + ' ' + classes.Special} />
                </div>
                <div className={classes.Grid }>
                    <Input ref={treatmentRef} className={classes.Special}
                     textArea rows='5' name='treatmentPlan' label='Treatment Plan box:' />
                </div>
                <div className={classes.Grid + ' '+ classes.Relative}>
                    <Button disabled={ loading || checkFormError(formError,formData)}
                    className={classes.Submit}>Save <Loading loading={loading}/></Button>
                    
                    
                </div>
            </form>
            <DoctorSelect onSelect={doctorSelectHandler} patientId={patientId} />
        </div>
    )
}
export default EncounterPatient;