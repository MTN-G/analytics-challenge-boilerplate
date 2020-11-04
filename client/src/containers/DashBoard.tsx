import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import MapChart from '../adminCharts/mapChart'
import ByDayChart from '../adminCharts/byDayChart'
import ByHourChart from "adminCharts/byHourChart";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <>
      <MapChart/>
      <ByDayChart/>
      <ByHourChart/>
    </>
  );
};

export default DashBoard;
