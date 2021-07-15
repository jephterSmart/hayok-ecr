
import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../../UI/Input";
import Select from "../../../UI/Select";

import classes from './login.module.css';

const Login = (props) => {
    const [role,setRole] = useState('specialist');
    const selectHandler = (e) => {
        setRole(e.target.value);
    }
    const submitHandler = (e) => {
        e.preventDefault();
        console.log(e);
    }
    return(
        <div className={classes.Login}>
            <form className={classes.Form}
            onSubmit={submitHandler}>
                <Select options={[{value:'specialist',displayValue:"Specialist"},
                {value:'patient',displayValue:"Patient"}]} defaultValue='specialist' 
                 onChange={selectHandler} Label="Role:"/>
                {
                    (role === 'specialist') ? (
                        <div>
                            <Input label="Username" type='text'/>
                            <Input label = 'Password' type='password' />
                            <p className={classes.Line}>
                                <Link className={classes.Link}
                                to='/auth/create'>Or Create Account</Link></p>
                        </div>
                    ):(
                        <div>
                            <Input label="First Name" type='text' />
                            <Input label = "Last Name" type='text' />
                            
                            
                        </div>
                    )
                }
                <button type="submit" className={classes.Btn}>Login</button>
            </form>
        </div>
    )
}
export default Login;