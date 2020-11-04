import React, { useEffect, useState } from "react";
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from "recharts";
import { Event, Location, eventName } from '../models/event'
import TextField from '@material-ui/core/TextField';

const OneHour: number = 1000 * 60 * 60; 
const OneDay: number = OneHour * 24
const OneWeek: number = OneDay*7

type ByDayData = {
    count: number,
    hour: string
}

const ByHourChart: React.FC = () => {

    const [day, setDay] = useState<number>(7)
    const [data, setData] = useState<ByDayData[]>([])
    // const [day2, setDay2] = useState<number>(6)
    // const [data2, setData2] = useState<ByDayData[]>([])

    useEffect(() => {
        async function getEventsByHours () {
            const { data } = await axios.get(`http://localhost:3001/events/by-hours/${day}`)
            setData(data)   
        }
        getEventsByHours()
    },[day])

    // useEffect(() => {
    //     async function getEventsByDays () {
    //         const { data } = await axios.get(`http://localhost:3001/events/by-hours/${day2}`)
    //         setData2(data)  
    //     }
    //     getEventsByDays()
    // },[day2])
    const handleChange = (date: Date) => {
        const msDate = date.getTime();
        const today = Date.now();
        const daysBack  = Math.floor((today - msDate) / OneDay )
        setDay(daysBack)
    }

   

  
  return (
   <>
    <TextField
    id="date"
    label="Birthday"
    type="date"
    onChange={e => handleChange(new Date(e.target.value))}
    defaultValue={new Date()}
    InputLabelProps={{
      shrink: true,
    }}
  />
     <LineChart width={700} height={300} data={data}>
        <Line type="monotone" dataKey="count"  stroke="#8884d8" />
        <Line type="monotone" dataKey="count2"  stroke="green" />
        <Tooltip/>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="hour" />
        <YAxis />
    </LineChart>
   </>
  );
};

export default ByHourChart