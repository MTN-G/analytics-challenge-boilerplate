import React, {useEffect, useState} from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import ErrorBoundry from '../components/ErrorBoundries';
import MapChart from '../adminCharts/mapChart';
import ByDayChart from '../adminCharts/byDayChart';
import ByHourChart from "adminCharts/byHourChart";
import PieCharts from "adminCharts/pieCharts";
import FilterChart from 'adminCharts/filterChart';
import RetentinTable from "adminCharts/retention/retentionTable";
import axios from 'axios';
import { Event } from '../models/event';

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
};

const DashBoard: React.FC = () => {
  
  const [data, setData] = useState<Event[]>([]);
  
  useEffect(() => {
    async function getEvents () {
        const response : Event[] = await (await axios.get(`http://localhost:3001/events/all`)).data;
        setData(response);
    };
    getEvents();
  }, []);


  return (
      <div style={{display: "flex", flexDirection: "column", gap: "50px", alignItems: "center"}}>
        <ErrorBoundry>
      <ErrorBoundry>
        <RetentinTable/>
      </ErrorBoundry>
      <ErrorBoundry>
        <FilterChart/>
      </ErrorBoundry>
      <ErrorBoundry>
        <PieCharts events={data}/>
      </ErrorBoundry>
      <ErrorBoundry>
        <MapChart events={data}/>
      </ErrorBoundry>
      <ErrorBoundry>
        <ByDayChart/>
      </ErrorBoundry>
      <ErrorBoundry>
        <ByHourChart/>
      </ErrorBoundry>
      </ErrorBoundry>
      </div>
  );
};

export default DashBoard;
