import {useState,useEffect} from 'react';

import Loading from '../UI/Spinner/loading';
import Button from '../UI/Button';
import classes from './pagination.module.css';

const Pagination = ({previousHandler,nextHandler,currentPage,totalItem,error}) => {
    //for monitoring clicks;
    const [previous,setPrevious] = useState(false) 
    const [next,setNext] = useState(false);
    useEffect(() => {
        setPrevious(false);
        setNext(false);
    },[currentPage,error]);

    const names =[classes.Pagination];
    if(currentPage === 1){
        names.push(classes.HidePrevious);
    }
    if(totalItem < 10){
        names.push(classes.HideNext)
    }
    const previousHand = (e) => {
        setPrevious(true);
        previousHandler(e)
    }
    const nextHand = (e) => {
        setNext(true);
        nextHandler(e);
    }
    return (<div className={names.join(' ')}>
        {currentPage === 1 ? null :<Button disabled={previous} raised onClick={previousHand}>
            <span>Previous</span><Loading  loading={previous}/></Button>}
        {totalItem < 10 ? null : <Button raised disabled={next} onClick={nextHand}>
            <span>Next </span><Loading  loading={next}/></Button>}
    </div>)
}
export default Pagination; 