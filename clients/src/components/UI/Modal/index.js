
import Button from '../Button';
import classes from './modal.module.css'; 

const Modal = ({onClose = ()=> {},children,onEncounter=() => {},openModal}) => {

    return(
        openModal && (<div className={classes.Backdrop} onClick={onClose}>
            <div className={classes.Modal}>
                <div onClick={onClose} className={classes.PrimaryAction}>
                    <span></span>
                    <span></span>
                </div>
                {children}
                <div className={classes.Action}>
                    <Button onClick={onClose} style={{backgrounColor:'transparent'}}>Done</Button>
                    <Button onClick={onEncounter} raised filled>Encounter</Button>
                </div>
            </div>
        </div>)
    )
}
export default Modal;