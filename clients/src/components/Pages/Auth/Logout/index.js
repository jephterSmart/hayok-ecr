
import {useEffect} from 'react';
import { Redirect } from "react-router";

import { useAuthDispatch,LOGOUT } from "../../../../store/authStore";


const Logout = () => {
    const dispatch = useAuthDispatch();
    useEffect(() => {
        dispatch({
            type: LOGOUT
        })
        localStorage.clear();

    },[])
    return (
        <Redirect to='/' />
    )
}

export default Logout;