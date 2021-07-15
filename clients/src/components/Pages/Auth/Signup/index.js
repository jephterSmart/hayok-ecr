
import { Link } from 'react-router-dom';
import Input from '../../../UI/Input';
import Select from '../../../UI/Select';
import classes from './create.module.css';

const Signup = () => {
    const submitHandler = (e) => {
        e.preventDefault();
        console.log(e)
    }

    return(
        <div className={classes.SignUp}>
            <form className={classes.Form} onSubmit={submitHandler}>
                <div className={classes.Grid}>
                <Input label='First Name:' name='firstName'/>
                <Input label='Last Name:' placeholder='Your surname' name='surname' />
                
                </div>

                <div className={classes.Grid}>
                <Input label="Age" type="number" name='age'/>
                <Select options={[
                    {value:'male',displayValue:'Male'},
                    {value:'female', displayValue:"Female"}
                ]} defaultValue='Select Gender' name='gender' Label="Gender:"/>
                </div>
                <div className={classes.Grid}>
                <Input label="Cadre:" placeholder="The profession you belong to (e.g Doctor)" 
                name='cadre'/>
                <Input label="Department:" name="department" /> 
                </div>
                <button type='submit' className={classes.Btn} >SignUp</button>
                <p className={classes.Line}><Link to='/auth/login'
                className={classes.Link}> Or Do you already have an Account? Log in.</Link></p>
            </form>

        </div>
    )
}
export default Signup;