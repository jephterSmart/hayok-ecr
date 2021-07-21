import { useState,useEffect } from "react";
import {Link} from 'react-router-dom';

import Button from "../../UI/Button";
import Card from "../../UI/Card";
import Skeleton from '../../UI/Spinner/skeleton';

//helper method
import {fetchPatients} from '../../../utils/patientsHelper';

//store
import {useAuthStore} from '../../../store/authStore';

import classes from './patient.module.css';
import Pagination from "../../Pagination";

const Patient = () => {
    
    const [patients,setPatients] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [error,setError] = useState('');
    const [successful,setSuccessful] = useState(false);
    const authStore = useAuthStore();

    useEffect(()=> {
       fetchPatients(authStore.token,10,currentPage)
       .then(pats =>{
        setPatients(pats.patients);
        setCurrentPage(1);
        setSuccessful(true);
       })
       .catch(err => {
           setError(err.message);
       })
        
    },[]);
    const nextHandler = () => {
        fetchPatients(authStore.token,10,currentPage+1).then(data => {
            setPatients(data);
            setCurrentPage(page => page + 1)
        })
        .catch(err => {
            setError(err.message)
        })
        
    }
    const previousHandler = () => {
        fetchPatients(authStore.token,10, currentPage-1)
        .then(data => {
            setPatients(data);
            setCurrentPage(page => page - 1)
        })
    }
    console.log(patients)
    return(
        <div className={classes.Patient}>
            <div className={classes.Actions}>
                <Button filled  raised><Link to='/user/add-patient' className={classes.Link}>Add Patients</Link></Button>
                <Button filled raised><Link to='/user/view-stat' className={classes.Link}>View Patients statistics</Link></Button>
            </div>
            <div>
                <h1>Patients we have in our system:</h1>
                {error ? <p style={{color:'red'}}>{error} - Check your connection and reload the page</p> :(
                    <div>
                    {
                        patients.length>0 ?(
                            patients.map(pat => <Card key={pat._id} data={pat}/>)
                            
                        ): (
                           <>
                            {successful ? (<p>We currently do not have patients</p>) :(
                                <>
                                <Skeleton />
                                <Skeleton />
                                </>
                            )}
                            
                            </>
                          
                        )
                    }
                </div>
                )}
                
                {patients.length > 0 && <Pagination 
                nextHandler={nextHandler} currentPage={currentPage}
                previousHandler={previousHandler} totalItem={patients.length}
                error={error}
                />}
                
            </div>
        </div>
    )
}

export default Patient;