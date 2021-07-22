
import { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../../../UI/Input";
import Select from "../../../UI/Select";

import classes from './login.module.css';
import { useAuthDispatch, useAuthStore } from "../../../../store/authStore";
import { doctorLoginHandler, patientLoginHandler } from "../../../../utils/authHelper";
import Loading from "../../../UI/Spinner/loading";

const Login = (props) => {
    const [role,setRole] = useState('specialist');
    const dispatch = useAuthDispatch();
    const authStore = useAuthStore();

    const selectHandler = (e) => {
        setRole(e.target.value);
    }
    const submitHandler = (e) => {
        e.preventDefault();
        console.log(role);
        if(role === 'specialist'){
            doctorLoginHandler(dispatch,e);
        }
        else{
            patientLoginHandler(dispatch,e)
        }
       
    }
    return(
        <div className={classes.Login}>
            <form className={classes.Form}
            onSubmit={submitHandler}>
                 <p className={`${classes.Error} ${authStore.error ? classes.Show : " " }`} >
                     { '*' + authStore.error?.message }</p>
                <Select options={[{value:'specialist',displayValue:"Specialist"},
                {value:'patient',displayValue:"Patient"}]} defaultValue='specialist' 
                 onChange={selectHandler} Label="Role:"/>
                {
                    (role === 'specialist') ? (
                        <div>
                            <Input label="Email" type='email' name='email'/>
                            <Input label = 'Password' type='password' name='password' />
                            <p className={classes.Line}>
                                <Link className={classes.Link}
                                to='/auth/create'>Or Create Account</Link></p>
                        </div>
                    ):(
                        <div>
                            <Input label="First Name" type='text' name='firstName'/>
                            <Input label = "Last Name" type='text' name='lastName' />
                            
                            
                        </div>
                    )
                }
                <button type="submit" className={classes.Btn} disabled={authStore.loading}><span>Login </span>
                <Loading loading={authStore.loading} /></button>
            </form>
        </div>
    )
}

export default Login;