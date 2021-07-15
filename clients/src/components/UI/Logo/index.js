
import Image from '../../../images/HayokLogo.png';
import classes from './logo.module.css';

const Logo = () => {
    return(
    <div className={classes.Logo}>
        <img src={Image} alt="Hayok Logo" />
    </div>)
}
export default Logo;