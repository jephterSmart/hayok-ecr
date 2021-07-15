
import classes from './bottom.module.css';

const Footer = () => {
    const moveHandler = (e) => {
        e.preventDefault();
        window.scrollTo(0,30);
    }
    return(
        <footer className={classes.Footer}>
            <h1>Uzezi Jephter Oghenekaro</h1>
            <div className={classes.Top}>
                <div className={classes.Line}></div>
                <div className={classes.TopLetter}><a href='#home' onClick={moveHandler}>Top</a></div>
            </div>
            <p>Designed and built by Uzezi Jephter Oghenekaro <br /> &copy; uzeziJephter, 2021.</p>
            
        </footer>
    )
}

export default Footer;