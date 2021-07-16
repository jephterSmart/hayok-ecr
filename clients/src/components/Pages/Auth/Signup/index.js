
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../UI/Input';
import Select from '../../../UI/Select';
import classes from './create.module.css';

const DetailsPage = ({next}) => {
  
    return(
        <div className={`${classes.Details} ${next?classes.Show: ' '} ${!next && classes.Hide}`}>
        <div className={classes.Grid}>
        <Input label='First Name:' name='firstName' required/>
        <Input label='Last Name:' placeholder='Your surname' name='surname' required/>
        
        </div>

        <div className={classes.Grid}>
        <Input label="Age" type="number" name='age' required/>
        <Select options={[
            {value:'male',displayValue:'Male'},
            {value:'female', displayValue:"Female"}
        ]} defaultValue='Select Gender' name='gender' Label="Gender:" />
        </div>
        <div className={classes.Grid}>
        <Input label="Cadre:" placeholder="The profession you belong to (e.g Doctor)" 
        name='cadre' required/>
        <Input label="Department:" name="department" required /> 
        </div>
        <button type='submit' className={classes.Btn} >Sign Up</button>
        </div>
    )
}
const RequiredDetails = ({nextHandler,next}) => {
    const PasswordRef = useRef();
    const ConfirmRef = useRef();
    const [error,setError] = useState(false);
    const changeHandler = (e) => {
        if(PasswordRef.current.value !== ConfirmRef.current.value){
            setError(true);
        }
        else nextHandler(e);
    }

    return(
        <div className={next && classes.Hide}>
        <div className={classes.Column}>
            {error && <p style={{color:'red',fontSize:'1.4rem'}}>* Passwords do not match</p>}
        <Input label='User Name:' name='userName' required />
        <Input label='Password:' name='password' type="password" required ref={PasswordRef}/>
        <Input label='Confirm Password' name='confirmPassword' type='password' required ref={ConfirmRef}/>
        
        </div>
        <button type='submit' className={classes.Btn + ' '+ classes.Next} 
        onClick={changeHandler}>Next</button>
        </div>
    )
}
const Signup = () => {
    const [next,setNext] = useState(false);
    const submitHandler = (e) => {
        e.preventDefault();
        console.log(e)
    }
    const nextHandler = (e) => {
        setNext(true);
    }
    return(
        <div className={classes.SignUp}>
            <form className={classes.Form} onSubmit={submitHandler} autoComplete>
                 <DetailsPage next={next}/> 
                 <RequiredDetails nextHandler={nextHandler} next={next}/>

                
                <p className={classes.Line}><Link to='/auth/login'
                className={classes.Link}> Or Do you already have an Account? Log in.</Link></p>
            </form>

        </div>
    )
}
export default Signup;