import React, { useEffect, useState } from "react";
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { weeklyRetentionObject } from '../../models/event'
import {Table, Cell} from './retention.styles'

export const OneHour: number = 1000 * 60 * 60; 
export const OneDay: number = OneHour * 24
export const OneWeek: number = OneDay*7
const today = new Date (new Date().toDateString()).getTime()+6*OneHour
const initialDayZero = today-5*OneWeek

type sorting = "%2Bdate" | "-date"

const RetentinTable: React.FC = () => {
    const [retention, setRetention] = useState<weeklyRetentionObject[]>([])
    const [dayZero, setdayZero] = useState<number>(initialDayZero)

    useEffect(() => {
        const  fetchRetentionData = async () => {
            const { data } = await axios.get(`http://localhost:3001/events/retention?dayZero=${dayZero}`) 
            setRetention(data)
        } 
        fetchRetentionData()
    },[dayZero])

    const handleChange = (e : React.ChangeEvent<{value: string }>, setState: Function) => {
        if (e.target.value === 'All') setState(undefined)
        else setState(e.target.value);
    }

    console.log(retention)

    retention.map(obj => {
        obj.start = obj.start.split('-').reverse().join().replaceAll(',', '/').slice(0 , 8);
        if (obj.start[4] === '/') obj.start = obj.start.slice(0 , 7);
        obj.end = obj.end.split('-').reverse().join().replaceAll(',', '/').slice(0 , 8);
        if (obj.end[4] === '/') obj.end = obj.end.slice(0 , 7);
    })


  return (
   <div style={{display: "flex", flexDirection: "column", gap: "20px" }}>
       <TextField
                id="date"
                label="Your data retention will start from: "
                type="date"
                onChange={e => setdayZero(new Date(e.target.value).getTime())}
                defaultValue={new Date()}
                InputLabelProps={{
                shrink: true,
                }}
        />
       <Table>
            <tr>
                <th id="corner"></th>
                {retention.map((obj: weeklyRetentionObject) => <th>{`Week ${obj.registrationWeek}`}</th>)}
            </tr>
            {retention.map((obj: weeklyRetentionObject) => 
                <tr>
                <td className="week-data">
                    {`${obj.start} - ${obj.end}`}
                    <span>{`new users: ${obj.newUsers}`}</span>
                </td>
                {obj.weeklyRetention.map((percent: number)=>
                 <Cell percent={percent}>{percent === null ? `---` : `${percent}%`}</Cell>
                )
            }</tr>
            )}

       </Table>
     </div>
  );
};

export default RetentinTable