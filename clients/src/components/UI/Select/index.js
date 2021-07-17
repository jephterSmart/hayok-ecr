import classes from './selection.module.css';

const Select = ({options,Label='rolling',...rest}) => {
    return(
        <div className={classes.Select}>
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