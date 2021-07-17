import { useState,useEffect } from "react";

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
    const addPatientHandler = () => {
        window.location.href = '/user/add-patient';
    }
    const viewPatientStatHandler = () => {
        window.location.href = '/user/view-patients-stat';
    }
    const [patients,setPatients] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [error,setError] = useState('')
    const authStore = useAuthStore();

    // useEffect(()=> {
    //    fetchPatients(authStore.token,10,currentPage)
    //    .then(pats =>{
    //     setPatients(pats);
    //     setCurrentPage(1);
    //    })
    //    .catch(err => {
    //        setError(err.message);
    //    })
        
    // },[]);
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
    return(
        <div className={classes.Patient}>
            <div className={classes.Actions}>
                <Button filled onClick={addPatientHandler} raised>Add Patients</Button>
                <Button filled onClick={viewPatientStatHandler} raised>View Patients statistics</Button>
            </div>
            <div>
                <p>Patients we have in our system</p>
                <div>
                    {
                        patients.length>0 ?(
                            patients.map(pat => <Card key={pat._id} data={pat}/>)
                            
                        ): (
                            <>
                            <Skeleton />
                            <Skeleton />
                            
                            </>
                        )
                    }
                </div>
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