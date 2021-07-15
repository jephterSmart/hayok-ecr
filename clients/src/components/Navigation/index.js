import NavigationItem from "./NavigationItem";

// import classes from './navigation.module.css';

const Navigation = ({isAuthenticated}) => {
    
    return(
        <nav>
            <ul>
               {isAuthenticated? (<NavigationItem>Logout</NavigationItem>) : 
               (<NavigationItem link='/auth/login' exact
               >Login</NavigationItem>)} 
            </ul>
        </nav>
    )
}
export default Navigation;