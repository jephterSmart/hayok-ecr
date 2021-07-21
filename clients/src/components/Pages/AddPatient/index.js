import {useState,useRef} from 'react';

import { useHistory,Link } from "react-router-dom";

//components
import Input  from '../../UI/Input';
import Button from '../../UI/Button';
import ButtonLike from '../../UI/Button/ButtonLike';
import Select from '../../UI/Select';
import Loading from '../../UI/Spinner/loading';


import classes from './add-patient.module.css';

//helper method
import {postFormData} from '../../../utils/patientsHelper';

//authState
import {useAuthStore} from '../../../store/authStore';

const initialData = {
    firstName: '',
    lastName: '',
    age:'',
    gender:'male',
    height: 0,
    weight: 0,
    ward: '',
    lga:'',
    state:'fct'
}
const create = value => ({value,displayValue:value[0].toUpperCase()+ value.substring(1)});
const valueArr = ["abia","adamawa","akwa Ibom","anambra","bauchi","bayelsa","benue","borno","cross River"
    ,"delta","ebonyi","edo","ekiti","enugu","gombe","imo","jigawa","kaduna","kano","katsina","kebbi",
    "kogi","kwara","lagos","nasarawa","niger","ogun","ondo","osun","oyo","plateau","rivers","sokoto","taraba",
    "yobe","zamfara"]
const stateOptions =valueArr.map(create);
stateOptions.unshift({value:'fct',displayValue:'FCT'});



const AddPatient = () => {
    

    const authStore = useAuthStore();
    
    //This controls form
    const [formData,setFormData] = useState(initialData);
    const [formError,setFormError] = useState({});
    // const [touched,setTouched] = useState(false);
    const checkFormError = (formError,formData) => {
        const errors = Object.values(formError).reduce((acc,err) => {
            //if(err === undefined) return acc+ "undefined";
            return acc+err;
        },"")
        const res = Object.values(formData).some(ele => ele === "" );
        
        return  res || errors.length > 1;
    }
    //for handling picures
    const [capture,setCapture] = useState(false);
    const [finishSnaping,setFinishSnaping] = useState(false);
    const CanvasRef = useRef();
    const VideoRef = useRef();
    const StreamRef = useRef();
    
    const startCaptureHandler = () => {
        setCapture(true);
        window.navigator.getUserMedia = window.navigator.getUserMedia || 
            window.navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia || window.navigator.oGetUserMedia
        if(!window.navigator.getUserMedia){
            setFormError(err => 
                ({...err,capture: "Check your device, and allow camera."}));
            return;
        }
        window.navigator.getUserMedia({video: true},
            mediaStream => {
                VideoRef.current.srcObject = mediaStream;
                StreamRef.current = mediaStream;
                VideoRef.current.onloadedmetadata = function(e) {
                    VideoRef.current.play();
                  };
            },error => {
                setFormError(err => 
                    ({...err,capture:error.message || 
                        "Could not capture, check your camera or use a different browser"}))
                        console.log(error);
            } )
        
        
    }
    const captureHandler = () => {
        const context = CanvasRef.current.getContext('2d');
        context?.drawImage(VideoRef.current,0,0,650,490);
        const Image = CanvasRef.current.toDataURL();
        setFormData(form => ({...form,imageData:{
            generatedAt: new Date().toISOString(),
            png: Image.split(',')[1]
        }}));
       
        VideoRef.current.pause();
        VideoRef.current.src = '';
        StreamRef.current.getTracks().forEach( track => {
            if (track.readyState == 'live') {
                track.stop();
            }
        })
        setFinishSnaping(true);
    }
    const changeHandler = e => {
        let ele = e.target;
        
        // setTouched(true);
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
    const [loading,setLoading] = useState(false);

    const LinkRef = useRef(); 
    const history = useHistory();
    const submitHandler = e => {
        e.preventDefault();
        setLoading(true);
   
        postFormData(authStore.token,formData,(err,formData) => {
            if(formData){
                setLoading(false);
                
                setCapture(false);
                history.push('/user/all-patients');
                LinkRef.current.click();
                return;
                }
                
            if(err){
                setFormError(error => ({...error, server: err.message || 
                    "An error Occured in the server"}));
                    setLoading(false);
                  
                    setCapture(false);
                    return;
            }
          
            
        })
        
    }
   
    
    return(
        <>
        
             <section className={classes.AddPatient}>
             <h1>Add Patient</h1>
             <p className={`${classes.Normal} ${formError.server? classes.Error : " "}`}>{formError.server}</p>
             <form onSubmit={submitHandler}>
                 <div className={classes.Grid}>
                     <Input required onChange={changeHandler} name="firstName" value={formData.firstName}
                     errormessage={formError.firstName} label='First Name:'/>
                     <Input onChange={changeHandler} name="lastName" value={formData.lastName}
                     errormessage={formError.lastName} label='Surname:' />
                 </div>
                 <div className={classes.Grid}>
                 <Input required onChange={changeHandler} name="age" value={formData.age}
                     errormessage={formError.age} label='Date of Birth:' type='date'/>
                 <Select onChange={changeHandler} name='gender' value= {formData.gender} 
                 options={[{value:'male',displayValue:'Male'},{value:'female',displayValue:'Female'}]}
                 Label="Gender:" errormessage={formError.gender} className={classes.Select}
                 />
                 </div>
                 <div className={classes.Grid}>
                 <Input required onChange={changeHandler} name="weight" value={formData.weight}
                     errormessage={formError.weight}  label="Weight (in Kg):" type='number' 
                     placeholder='Weight should be in Kg'/>
                 <Input required onChange={changeHandler} name="height" value={formData.height}
                     errormessage={formError.height} label='Height (in meters):' type='number' 
                     placeholder='Height should be in meters'/>
                 <Input required onChange={changeHandler} name="ward" value={formData.ward}
                     errormessage={formError.ward} label='Ward:'/>
                 </div>
                 <div className={classes.Grid}>
                 
                 <Input required onChange={changeHandler} name="lga" value={formData.lga}
                     errormessage={formError.lga} label="Local Government Area:"/>
                 <Select onChange={changeHandler} name='state' value= {formData.state} 
                 options={stateOptions} className={classes.Select} 
                 Label="State:" errormessage={formError.state}/>
                 </div>
                 <div >
                 <p className={`${classes.Normal} ${formError.capture? classes.Error : " "}`}>{formError.capture}</p>
                     {
                         !capture ?(
                             <ButtonLike onClick={startCaptureHandler} fullWidth filled >Start Image Capture
                             </ButtonLike>
                         ):(
                             <div className={classes.Picture}>
                                 <div className={`${classes.Canvas} ${!finishSnaping? classes.Hide : " "}`}>
                                     <canvas ref={CanvasRef} width='650' height='490' ></canvas>
                                     <ButtonLike raised onClick={() => {
                                         console.log("I am clicked");
                                         startCaptureHandler();
                                         setFinishSnaping(false);
                                     }}>Re - Capture Picture</ButtonLike>
                                 </div>
                                    
                                 <div className={`${classes.VideoContainer} ${finishSnaping? classes.Hide : " "}`}>
                                 <video playsInline ref={VideoRef} width='650' height='490' ></video>
                                 <ButtonLike onClick={captureHandler} className={classes.Btn}>
                                     Take Photo
                                 </ButtonLike>
                             </div>
                                  
                             </div>
                         )
                     }
                     
                     
                 </div>
                 <Button disabled ={loading || checkFormError(formError,formData) } 
                 type='submit' filled raised className={classes.Submit}>Submit
                 <Loading loading={loading} /></Button>
             </form>
             <div style={{display:'none'}} ref={LinkRef}><Link to='/user/all-patients' /> </div>
         </section>
       
       
        </>
    )
}

export default AddPatient;