
import classes from './btn.module.css';

const Button = ({filled,className,fullWidth,raised, children, ...rest}) => {
    const names = [classes.Button]
    if(filled) names.push(classes.filled);
    if(className) names.push(className)
    if(fullWidth) names.push(classes.fullWidth);
    if(raised) names.push(classes.shadow);
    
    return (
        <button className={names.join(' ')}>{children}</button>
    )
}

export default Button;
