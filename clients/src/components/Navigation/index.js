import NavigationItem from "./NavigationItem";

//store values
import { useAuthStore } from "../../store/authStore";

import classes from './navigation.module.css';

const Navigation = () => {
    const authStore = useAuthStore();
    const notSeen = authStore.notifications.reduce((acc,ele) => {
        if(ele.seen == false) return acc + 1;
        else return acc;
    },0)
    return(
        <nav>
            <ul className={classes.Nav}>
               {authStore.authenticated? (
                <>
                {authStore.userType === 'doctor' ? 
                (<>
                <NavigationItem link='/user/notifications'>Notifications {notSeen}</NavigationItem>
                <NavigationItem link='/user/all-patients'>Patients</NavigationItem>
                </>):<NavigationItem link='/user/records'>Records</NavigationItem>}
               <NavigationItem link = '/auth/logout'>Logout</NavigationItem>
               </>
               ) : 
               (<>
               <NavigationItem link='/auth/login' exact
               >Login</NavigationItem>
               <NavigationItem link='/auth/create' >Sign Up</NavigationItem>
               </>)} 
            </ul>
        </nav>
    )
}
export default Navigation;