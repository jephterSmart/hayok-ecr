import { useEffect, useState } from "react";

import { Bar,Pie } from 'react-chartjs-2';

import { getPatientsStatistics } from "../../../utils/patientsHelper";
import { useAuthStore } from "../../../store/authStore";

import Popup from "../../UI/Popup";

import classes from './statistics.module.css';
const options = {
    scales: {
      yAxes: [
        {
          ticks: {
           
            stepSize:1,
            min:0
          },
        },
      ],
    },
  };
  
const Statistics = () => {
    const {token,statistics} = useAuthStore();
    const [statistic, setStatistic] = useState({});
    const [error, setError] = useState('');
    useEffect(() => {
        getPatientsStatistics(token)
        .then(stat => {
            setError('');
            
            setStatistic(stat)
        })
        .catch(err => {
            setError(err.message || 'could not get statistics');
        })
    },[]);
    const data1 = {
        labels: ['0 to 19', '20 to 39', '40 to 59', '60 to 79', '80 to 99', '100 to 119'],
        datasets: [
          {
            label: 'Age disagreegation of patients',
            backgroundColor: 'rgba(0, 0, 255, 0.8)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      };
      const data2 = {
        labels: ['male','female'],
        datasets: [
          {
            label: 'Gender disagregation of patients',
            backgroundColor: ['rgba(0, 0, 255, 0.8)','rgba(255,0,255,0.8)'],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      };
      useEffect(() => {
        setStatistic(statistics);
      },[statistics])
     if(statistic.age){
        data1.datasets[0].data = Object.values(statistic ? statistic.age : {} );
      data2.datasets[0].data = Object.values(statistic ? statistic.gender : {});
      console.log(statistic)
     }
      
    return(
        <div className={classes.Stat}>
            {error && <Popup time={5000}>{error}</Popup>}
            { statistic.age && (
                <>
            <Bar options={options} data={data1} />
            <Pie data={data2} />
            </>)
            }
        </div>
    )
}
export default Statistics;