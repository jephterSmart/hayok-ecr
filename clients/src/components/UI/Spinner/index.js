
import classes from './spinner.module.css';

const Spinner = () => (
    <div className={classes.body} >
        <div className={classes.container}>
            <div className={classes.top}></div>
            <div className={classes.bottom} >
                <div className={classes.left} ></div>
                <div className={classes.right} ></div>
            </div>
        </div>
    </div>
)

export default Spinner;