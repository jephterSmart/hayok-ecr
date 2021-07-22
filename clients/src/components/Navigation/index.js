import { useState } from "react";
import NavigationItem from "./NavigationItem";

//store values
import { useAuthStore } from "../../store/authStore";

import classes from './navigation.module.css';

import Badge from '../UI/Badge';
import {Records,Login,Logout,NotificationActive,NotificationImportant,
    MessageUnread,Groups,Signup,Message,Home} from '../Icons'

const NavIcon = ({text,Icon}) => {
    return(
        <div className={classes.NavIcon}>
            <span className={classes.Icon}>{Icon}</span>
            <span>{text}</span>
        </div>
    )
}
const initialData = {
    home:true,
    messages:false,
    notifications:false,
    patients:false
    ,records:false,
    login:false,
    signup:false,logout:false
}
const Navigation = () => {
    const authStore = useAuthStore();
    const notSeen = authStore.notifications.reduce((acc,ele) => {
        if(ele.seen == false) return acc + 1;
        else return acc;
    },0)
   
    const [currentPage,setCurrentPage] = useState(initialData);

    const isActiveHandler = (address) => {
    
        return () => {
           
            const newPage = JSON.parse(JSON.stringify(currentPage));
                let pages = Object.keys(currentPage);
                for(let p of pages){
                    newPage[p] = false;
                }
                newPage[address] = true;
            setCurrentPage(newPage);
                

        }
    }
    return(
        <nav>
            <ul className={classes.Nav}>
                <NavigationItem link='/' exact='true' isActive={isActiveHandler('home')} active={currentPage.home}>
                    <NavIcon Icon={<Home style={{color: currentPage.home ?'rgb(65, 65, 255)':'var(--primaryColor)'}} />} text="Home" />
                </NavigationItem>
               {authStore.authenticated? (
                <>
                <NavigationItem link='/user/messages' isActive={isActiveHandler('messages')} active={currentPage.messages}>
                        <Badge content={notSeen} hide={notSeen === 0}>
                            <NavIcon Icon={notSeen?
                            <MessageUnread style={{color: currentPage.messages ?'rgb(65, 65, 255)':'var(--primaryColor)'}} />:
                            <Message style={{color: currentPage.messages ?'rgb(65, 65, 255)':'var(--primaryColor)'}} />} text='Messages' />
                        </Badge>
                    </NavigationItem>
                {authStore.userType === 'doctor' ? 
                (<>
                    <NavigationItem link='/user/notifications' 
                    isActive={isActiveHandler('notifications')} active={currentPage.notifications}>
                        <Badge content={notSeen} hide={notSeen === 0}>
                            <NavIcon Icon={notSeen ?
                            <NotificationImportant style={{color: currentPage.notifications ?'rgb(65, 65, 255)':'var(--primaryColor)'}}/>:
                            <NotificationActive style={{color: currentPage.notifications ?'rgb(65, 65, 255)':'var(--primaryColor)'}}/>} 
                            text='Notifications' />
                        </Badge>
                    </NavigationItem>
                <NavigationItem link='/user/all-patients'
                isActive={isActiveHandler('patients')} active={currentPage.patients}>
                    <NavIcon Icon={<Groups style={{color: currentPage.patients ?'rgb(65, 65, 255)':'var(--primaryColor)'}} />} 
                    text='Patients' />
                </NavigationItem>
                </>):<NavigationItem link='/user/records'
                    isActive={isActiveHandler('records')} active={currentPage.records}>
                    <NavIcon Icon={<Records 
                    style={{color: currentPage.records ?'rgb(65, 65, 255)':'var(--primaryColor)'}}/>} 
                    text='Records' />
                    </NavigationItem>}
               <NavigationItem link = '/auth/logout'
               isActive={isActiveHandler('logout')} active={currentPage.logout}>
                   <NavIcon Icon={<Logout 
                   style={{color: currentPage.logout ?'rgb(65, 65, 255)':'var(--primaryColor)'}}/>} 
                   text='Logout' />
                   </NavigationItem>
               </>
               ) : 
               (<>
               <NavigationItem link='/auth/login' exact
               isActive={isActiveHandler('login')} active={currentPage.login}
               ><NavIcon Icon={<Login 
                style={{color: currentPage.login ?'rgb(65, 65, 255)':'var(--primaryColor)'}}/>}
                text='Login' /></NavigationItem>
               <NavigationItem link='/auth/create' 
               isActive={isActiveHandler('signup')} active={currentPage.signup}><NavIcon Icon={<Signup 
                style={{color: currentPage.signup ?'rgb(65, 65, 255)':'var(--primaryColor)'}}/>}
                text='Create' />
               </NavigationItem>
               </>)} 
            </ul>
        </nav>
    )
}
export default Navigation;