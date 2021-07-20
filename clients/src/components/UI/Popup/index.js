
import { useEffect, useState } from 'react';
import classes from './popup.module.css'

const Popup = ({children,time=500,className,danger,...rest}) => {
    const names = [classes.Popup];
    if(className) names.push(className);
    if(danger) names.push(classes.Danger);

    
    const[out,setOut]=useState(false);
    const[mount,setMount] = useState(true);

    if(out) names.push(classes.Out)
    useEffect(()=> {
        let idOut = setTimeout(()=>{
            setOut(true)
        },time);
        let idUnmout = setTimeout(()=>{
            setMount(false)
        },time+300);
        return () => {
            clearTimeout(idOut);
            clearTimeout(idUnmout);
        }
    },[])
   
    const component =  (
        <div {...rest} className={names.join(' ') } 
        style={{transitionDuration:`${time}ms`}}>
            {children}
        </div>
    )
    if(!mount)
    component = null;
    return component
}
export default Popup;