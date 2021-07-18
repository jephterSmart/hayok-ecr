import classes from './selection.module.css';

const Select = ({options,Label='rolling',className,...rest}) => {
    return(
        <div className={`${classes.Select} ${className? className : ' '}`}>
                <label htmlFor={Label}>{Label}</label>
                <select id={Label} {...rest}>
                    {options.map(opt => (
                        <option key ={opt.value}value={opt.value}>{opt.displayValue}</option>
                    ))}
                </select>
                </div>
    )
}
export default Select;