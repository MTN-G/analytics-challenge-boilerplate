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
    date: string
}

const ByDayChart: React.FC = () => {

    const [day, setDay] = useState<number>(7)
    const [data, setData] = useState<ByDayData[]>([])

    useEffect(() => {
        async function getEventsByDays () {
            const { data }  = await axios.get(`http://localhost:3001/events/by-days/${day}`)
            setData(data)  
        }
        getEventsByDays()
    },[day])
    
    const handleChange = (date: Date) => {
        const msDate = date.getTime();
        const today = Date.now();
        const daysBack  = Math.floor((today - msDate) / OneDay )
        setDay(daysBack)
    }

    data.map(day => {
        day.date = day.date.slice(-5).replace('-', '/')
    })
  
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
        <Tooltip/>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
    </LineChart>
   </>
  );
};

export default ByDayChart