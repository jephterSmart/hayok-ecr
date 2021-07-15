import {forwardRef} from 'react';
import classes from './Input.module.css';

const Input = forwardRef(({textArea,label,...rest},ref) => {

    return(
        <div className={classes.Input} >
            <label htmlFor={rest.id}>{label}</label>
            {textArea ? <textarea {...rest} ref={ref} /> : <input {...rest} ref={ref}/>}
            
        </div>
    )
});
export default Input;