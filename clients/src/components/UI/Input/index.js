import {forwardRef} from 'react';
import classes from './Input.module.css';

const Input = forwardRef(({textArea,label,errormessage,className,...rest},ref) => {


    return(
        <div className={`${classes.Input} ${errormessage ? classes.InputError : ' '} 
        ${className?className: ' '}`} >
            <p className={errormessage? classes.Error: classes.Normal}>{errormessage}</p>
            <label htmlFor={rest.id}>{label}</label>
            {textArea ? <textarea {...rest} ref={ref} /> : <input {...rest} ref={ref}/>}
           
            
        </div>
    )
});
export default Input;