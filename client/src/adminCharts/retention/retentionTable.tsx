import React, { useEffect, useState } from "react";
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { weeklyRetentionObject } from '../../models/event';
import {Table, Cell} from './retention.styles';


export const OneHour: number = 1000 * 60 * 60; 
export const OneDay: number = OneHour * 24;
export const OneWeek: number = OneDay*7;
const today = new Date (new Date().toDateString()).getTime()+6*OneHour;
const initialDayZero = today-5*OneWeek;

const RetentinTable: React.FC = () => {
    const [retention, setRetention] = useState<weeklyRetentionObject[]>([]);
    const [dayZero, setdayZero] = useState<number>(initialDayZero);

    useEffect(() => {
        const  fetchRetentionData = async () => {
               const  response : weeklyRetentionObject[] = await (await axios.get(`http://localhost:3001/events/retention`, {
                   params: {
                       dayZero
                   }
               })).data; 
               setRetention(response);   
        } 
        fetchRetentionData();
    },[dayZero]);


    retention.map((obj: weeklyRetentionObject) => {
        obj.start = obj.start.split('-').reverse().join().replaceAll(',', '/').slice(0 , 8);
        if (obj.start[4] === '/') obj.start = "0" + obj.start.slice(0 , 7);
        obj.end = obj.end.split('-').reverse().join().replaceAll(',', '/').slice(0 , 8);
        if (obj.end[4] === '/') obj.end = "0" + obj.end.slice(0 , 7);
    });


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
        <thead>
            <tr>
                <th id="corner"></th>
                {retention.map((obj: weeklyRetentionObject, i: number) => <th key={i}>{`Week ${obj.registrationWeek}`}</th>)}
            </tr>
        </thead>
        <tbody>
            {retention.map((obj: weeklyRetentionObject, i: number) => 
                <tr key={i}>
                <td className="week-data">
                    {`${obj.start} - ${obj.end}`}
                    <span>{`new users: ${obj.newUsers}`}</span>
                </td>
                {obj.weeklyRetention.map((percent: number, i: number)=>
                 <Cell key={i} percent={percent}>{percent === null ? `---` : `${percent}%`}</Cell>
                )
            }</tr>
            )}
        </tbody>
       </Table>
     </div>
  );
};

export default RetentinTable;