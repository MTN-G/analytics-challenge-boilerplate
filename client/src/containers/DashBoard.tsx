import React, {useEffect, useState} from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import MapChart from '../adminCharts/mapChart'
import ByDayChart from '../adminCharts/byDayChart'
import ByHourChart from "adminCharts/byHourChart";
import PieCharts from "adminCharts/pieCharts";
import FilterChart from 'adminCharts/filterChart'
import axios from 'axios'
import { Event } from '../models/event'
import { FormatAlignCenter } from "@material-ui/icons";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  
  const [data, setData] = useState<Event[]>([])
  
  useEffect(() => {
    async function getEvents () {
        const { data }  = await axios.get(`http://localhost:3001/events/all`);
        setData(data)
    }
    getEvents()
  }, [])


  return (
    <div style={{display: "flex", flexDirection: "column", gap: "50px", alignItems: "center"}}>
      <FilterChart/>
      <PieCharts events={data}/>
      <MapChart events={data}/>
      <ByDayChart/>
      <ByHourChart/>
    </div>
  );
};

export default DashBoard;
