
import classes from './badge.module.css';

const Badge = ({children,position='right',content,hide,className='',...rest}) => {
    const names = [classes.Badge];
    if(position !=='right') names.push(classes.Left);
    if(className) names.push(className);
    let badge = (
        <div className={names.join(" ")} {...rest}>
            <span className={classes.Content}>{content}</span>
            <span>{children}</span>
        </div>
    )
    if(hide) 
    badge = <>{children} </>
    return badge
}
export default Badge;