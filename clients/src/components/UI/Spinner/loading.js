
import classes from './loading.module.css';
const Loading = ({loading,className}) => (<div 
    className={`${classes.loader} ${loading? classes.Show : " "} ${className ? className : " "}`}></div>)
export default Loading