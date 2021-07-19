
import Button from '../Button';
import classes from './card.module.css';

const Card = ({data}) => {
    let time = new Date.toLocaleString(data.time);
    return(
        <div className={classes.Card}>
            <div className={classes.Left}>
                <div className={classes.Img}><img src={data.imageSrc} /></div>
                <div className={classes.Data}>
                    <p>{data.firstName}</p>
                    <p>{data.lastName}</p>
                </div>
            </div>
            <div className={classes.Right}>
            <p >Last time active:<br /> <strong>{time}</strong></p>
            <Button className={classes.btn} filled>Encounter</Button>
            </div>
        </div>
    )
}

export default Card;
