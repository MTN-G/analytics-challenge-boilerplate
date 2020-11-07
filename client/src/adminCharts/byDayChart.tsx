import React, { useEffect, useState } from "react";
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from "recharts";
import TextField from '@material-ui/core/TextField';

const OneHour: number = 1000 * 60 * 60; 
const OneDay: number = OneHour * 24

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
        day.date = day.date.split('-').reverse().join().replaceAll(',', '/').slice(0 , 8);
        if (day.date[4] === '/') day.date = day.date.slice(0 , 7);
        
    })

  return (
   <>
    <div>
        <p>{data[6] && `Total events per day between ${data[0].date} to ${data[6].date}`}</p>
        <TextField
                id="date"
                label="Week ago From:"
                type="date"
                onChange={e => handleChange(new Date(e.target.value))}
                defaultValue={new Date()}
                InputLabelProps={{
                shrink: true,
                }}
        />
            </div>
     <LineChart width={750} height={300} data={data} >
        <Line type="monotone" dataKey="count"  stroke="#8884d8" />
        <Tooltip/>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis/>
    </LineChart>
    
   </>
  );
};

export default ByDayChart