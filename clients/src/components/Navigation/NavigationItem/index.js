import {NavLink} from 'react-router-dom';

import classes from './navigation_item.module.css';

const NavigationItem = ({link='/',exact,active,isActive, ...rest}) => {
    const names = [classes.NavItem];
    if(active) names.push(classes.Active);
    return (
        <li  onClick={isActive}className={names.join(' ')}><NavLink 
        activeClassName={classes.active} exact={exact} to={link}>{rest.children}</NavLink></li>    
    )
}

export default NavigationItem;