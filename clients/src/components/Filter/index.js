import {useRef,useState} from 'react';

import {fetchPatients} from '../../utils/patientsHelper';
import {useAuthStore} from '../../store/authStore';

import {FilterAlt,FilterList} from '../Icons';

import Select from '../UI/Select';
import Button from '../UI/Button';
import Input from '../UI/Input';

import classes from './filter.module.css';

const initialData = {
    age:{operation:'equal',value:20},
    gender:{type:'male'},
    bmi:{operation:'equal', value:10}
}

const Filter = ({submitHandler,perPage,currentPage}) => {
    const SelectRef = useRef();
    // for managing visibility of form
    const [ageVisible,setAgeVisible] = useState(false);
    const [genderVisible,setGenderVisible] = useState(false);
    const [bmiVisible,setBmiVisible] = useState(false);
    const [formData,setFormData] = useState(initialData);

    const {token} =useAuthStore();

    const changeHandler = ({target:{name,value}}) => {
        let key = SelectRef.current.value;
        let newFormData = JSON.parse(JSON.stringify(formData));
        newFormData[key][name] = value;
        setFormData(newFormData);

    }
    const getHandler = e =>{
        e.preventDefault();
        let key = SelectRef.current.value;
        /*produce query string that is like this
            ?criteria=key & operation=equal & value=30 
            for gender
            ?criteria=gender & value= 'male'
        */
        let queryString = '?criteria='
       if(key === 'gender'){
           queryString = queryString + key + '&value=' +formData[key].type;
       }
       else{
        let keys = Object.keys(formData[key]);
        queryString = queryString + key + '&';
        for(let k of keys){
            queryString = queryString + k + '=' + formData[key][k] + '&';
            
        }
        queryString = queryString.substring(0,queryString.length-1);
       }
       fetchPatients(token,perPage,currentPage,queryString)
       .then(filteredPatient => {
        submitHandler(filteredPatient.patients);
       })
       .catch(err => {
           submitHandler(null,err);
       })
        
    }
    const selectHandler = ({target:{value}}) => {
        if(value === 'age'){
            setAgeVisible(true);
            setGenderVisible(false);
            setBmiVisible(false);
        }
        if(value==='gender'){
            setGenderVisible(true);
            setAgeVisible(false);
            setBmiVisible(false);
        }
        if(value ==='bmi'){
            setBmiVisible(true);
            setAgeVisible(false);
            setGenderVisible(false);
        
        }
         if(value === ''){
            setBmiVisible(false);
            setAgeVisible(false);
            setGenderVisible(false);
         }   
    }
    return(
        <div className={classes.Filter}>
            <div className={classes.Icon}><FilterAlt style={{color:'darkblue'}} /><span>Filter By</span></div>
            <form onSubmit={getHandler} className={classes.Form}>
            <Select hideLabel onChange={selectHandler} ref={SelectRef}
            options={[
                {value:'',displayValue:'Select filter criteria'},
                {value:'age', displayValue:'Filter Patients by Age'},
                {value:'gender',displayValue:'Filter Patient by Gender'}
                ,{value:'bmi',displayValue:'Filter Patient by BMI'}]}
                className={classes.Criteria + ' ' + classes.Select}/>
            <div className={`${classes.Container} ${ageVisible ? classes.Visible : ' '} `} >
                <Select hideLabel onChange={changeHandler} name='operation' 
                value={formData.age.operation} options={[
                    {value:'equal',displayValue:'Equal To '},
                    {value:'less-than',displayValue:"Less Than or Equal"},
                    {value:'greater-than',displayValue:'Greater Than or Equal'}
                ]} 
                className={classes.Select}/>
                <Input className={classes.Input} placeholder="The Age value to compare against, e.g., 30" type='number'
                onChange={changeHandler} name='value' value={formData.age.value} />
                </div>
            <div className={`${classes.Container} ${bmiVisible ? classes.Visible : ' '}`} >
                <Select hideLabel onChange={changeHandler} name='operation' value={formData.bmi.operation} options={[
                    {value:'equal',displayValue:'Equal To '},
                    {value:'less-than',displayValue:"Less Than or Equal"},
                    {value:'greater-than',displayValue:'Greater Than or Equal'}
                ]}
                className={classes.Select} />
                <Input className={classes.Input}
                placeholder="The BMI value to compare against, e.g., 6" step='0.2' type='number'
                onChange={changeHandler} name='value' value={formData.bmi.value} />
                </div>
            <div className={`${classes.Container} ${genderVisible ? classes.Visible : ' '}`} >
                <Select hideLabel className={classes.Select}
                onChange={changeHandler} name='type' value={formData.gender.type} options={[
                    {value:'male',displayValue:'Male'},
                    {value:'female',displayValue:"Female "}
                ]} />
                
                </div>
                <Button type='submit' className={classes.Submit} raised filled>Filter<FilterList /></Button>
        </form>
        </div>
        
    )
}

export default Filter;