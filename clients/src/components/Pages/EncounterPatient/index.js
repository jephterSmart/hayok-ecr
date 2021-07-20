import {useHistory, useParams} from 'react-router-dom';
import {useState} from 'react';

import {updatePatientInfo} from '../../../utils/patientsHelper'

import classes from './encounter.module.css';
import Input from '../../UI/Input';
import DoctorSelect from './doctorSelect';
import { useAuthStore } from '../../../store/authStore';
import Popup from '../../UI/Popup';

const initialData = {
    dateOfEncounter:'',
    timeOfEncounter:'',
    visits:'firstTime',
    height:0,
    weight:0,
    bloodPressure: '',
    temperature:36.5,
    respiratoryRate: '',
    complaints:'',
    treatmentPlan:'',
    diagnosis: 'others',
}

const EncounterPatient = () => {
    const {patientId} = useParams();
    const history = useHistory();

    const authStore = useAuthStore();

    const [formData,setFormData] = useState(initialState);
    const [formError,setFormError] = useState();
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
    const checkFormError = (formError) => {
        const errors = Object.values(formError).reduce((acc,err) => {
            // if(err === undefined) return acc;
            return acc+err;
        },"")
        return errors.length > 1;
    }
    const submitHandler = e => {
        e.preventDefault();
        setLoading(true);
        updatePatientInfo(authStore.token,patientId,formData)
        .then(updatedData => {
            setLoading(false);
            console.log(updatedData)
            setMessage("Details has been saved")
            setTimeout(()=> {
                history.push('/user/all-patients') 
            },time);
                   
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
        <div classsName={classes.Encounter}>
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
                    <Select label='Visits:' defaultValue='firstTime' name='visits' onChange={changeHandler}
                     value={formData.visits}
                    options={[{value:'firstTime',displayValue:'First Time'}, 
                    {value:'repeat',displayValue: 'Repeat'}]}  classsName={classes.Select}/>
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
                     name='bloodPressure' label='Blood Pressure (BP):'
                    />
                    <Input errormessage={formError.temperature} onChange={changeHandler} value={formData.temperature}
                     name='temperature' label='Temperature' type='number'
                    steps='0.1' />
                    <Input errormessage={formError.respiratoryRate} onChange={changeHandler} value={formData.respiratoryRate}
                     name='respiratoryRate' label='Respiratory Rate (RR):' />
                </div>
                <div className={classes.Grid}>
                    <Input errormessage={formError.complaints} onChange={changeHandler} value={formData.complaints}
                     textArea rows='5' name='complaints' label='Complaints Box' />
                </div>
                <div className={classes.Grid}>
                    <Select name='diagnosis' Label='Diagnosis :' defaultValue='others'
                        options={[{value:'hyperTension',displayValue:'HyperTension'},
                        {value:'pneumonia',displayValue:'Pneumonia'},{displayValue:'Malaria',value:'malaria'},
                        {value:'diabetes',displayValue:'Diabetes :'},{value:'others',displayValue:'Others'}]}
                        classsName={classes.Select} />
                </div>
                <div className={classes.Grid}>
                    <Input errormessage={formError.dateOfEncounter} onChange={changeHandler} value={formData.dateOfEncounter}
                     textArea rows='5' name='treatmentPlan' label='Treatment Plan box:' />
                </div>
                <div className={classes.Grid}>
                    <Button disabled={checkFormError(formError)}>Save <Loading loading={loading}/></Button>
                    <DoctorSelect onSelect={doctorSelectHandler} patientId={patientId} />
                    
                </div>
            </form>
        </div>
    )
}
export default EncounterPatient;