import { forwardRef } from 'react';
import classes from './selection.module.css';

const Select = forwardRef(({hideLabel,options,Label='roll',className,...rest},ref) => {
    return(
        <div className={`${classes.Select} ${className? className : ' '}`}>
                <label htmlFor={Label} style={{display: hideLabel?'none':'block'}}>{Label}</label>
                <select id={Label} {...rest} ref={ref}>
                    {options.map(opt => (
                        <option key ={opt.value}value={opt.value}>{opt.displayValue}</option>
                    ))}
                </select>
                </div>
    )
})
export default Select;