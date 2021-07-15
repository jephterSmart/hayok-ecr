import {NavLink} from 'react-router-dom';

import classes from './navigation_item.module.css';

const NavigationItem = ({link='/',exact, ...rest}) => {
    return (
        <li className={classes.NavItem}><NavLink
        activeClassName={classes.active} exact={exact} to={link}>{rest.children}</NavLink></li>    
    )
}

export default NavigationItem;