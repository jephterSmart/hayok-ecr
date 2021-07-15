import { useEffect, useState} from 'react';

import Logo from '../../components/UI/Logo';
import Navigation from '../../components/Navigation';

import classes from './layout.module.css';
import Footer from '../../components/Footer';

const Layout = ({children, ...rest}) => {
    
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
        <div className={classes.Logo} >
            <Logo />
        </div>
        <Navigation isAuthenticated={false} />  
    </header>
    <div className={classes.content} >
        <main >
            {children}
        </main>
        <Footer />
    </div>
    </>
    )
    }
export default Layout;