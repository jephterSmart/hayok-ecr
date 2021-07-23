import { useEffect, useState} from 'react';

import Logo from '../../components/UI/Logo';
import Navigation from '../../components/Navigation';

import classes from './layout.module.css';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

import Messages from '../../components/MessagesSummary';
import { useAuthStore } from '../../store/authStore';

const Layout = ({children, ...rest}) => {
    const {authenticated} = useAuthStore();

    const [yPos, setYPos] = useState(200);
    const [hide,setHide] = useState(false);

    useEffect(() => {
        const scrollHandler = () => {
            if(window.scrollY > yPos){
                setHide(true);
                
            }
            else{
                setHide(false);
            }
            setYPos(window.scrollY);
           
        }
        window.addEventListener('scroll',scrollHandler);
        return () => {
            window.removeEventListener('scroll',scrollHandler);
        }
    },[])
    

return(
    <>
    <header className={`${classes.Header} ${hide ? classes.hide: ' '}`}  >
        <Link to='/' className={classes.Logo} >
            <Logo />
        </Link>
        <Navigation />  
    </header>
    <div className={classes.content} >
        <main >
            {children}
        </main>
        <Footer />
        {authenticated && <Messages />}
    </div>
    
    </>
    )
    }
export default Layout;