import React, { useEffect, useState } from "react";
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from "recharts";
import TextField from '@material-ui/core/TextField';

const OneHour: number = 1000 * 60 * 60; 
const OneDay: number = OneHour * 24

type ByHourData = {
    count: number,
    hour: string
}

const ByHourChart: React.FC = () => {

    const [daysBack, setDaysBack] = useState<number>(7)
    const [data, setData] = useState<ByHourData[]>([])

    useEffect(() => {
        async function getEventsByHours () {
            const response: ByHourData[] = await (await axios.get(`http://localhost:3001/events/by-hours/${daysBack}`)).data;
            setData(response); 
        }
        getEventsByHours()
    },[daysBack])

    const handleChange = (date: Date) => {
        const msDate = date.getTime();
        const today = Date.now();
        const daysBack  = Math.floor((today - msDate) / OneDay )
        setDaysBack(daysBack)
    }

  return (
   <>
    <TextField
        id="date"
        label="Pick Day"
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
        <XAxis dataKey="hour" />
        <YAxis />
    </LineChart>
   </>
  );
};

export default ByHourChart