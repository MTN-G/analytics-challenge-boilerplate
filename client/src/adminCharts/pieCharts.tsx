import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend} from "recharts";
import { Event } from '../models/event'

type PieChartData = {
    name: string,
    value: number
}

function createPieChartData (data: any[], newData: PieChartData[], key: string) {
    data.forEach((event: any) => {
        if (newData.some((obj: PieChartData) => obj.name === event[key])) {
            newData.map((obj: PieChartData) => {
                if (obj.name === event[key]) obj.value++
            })
        } else newData.push({name: event[key], value: 1})
    })
}

const PieCharts: React.FC<{events: Event[]}> = ({events}) => {

    const [data, setData] = useState<PieChartData[][]>([])

    useEffect(() => {
        const dataByPageName: PieChartData[] = [];
        const dataByOs: PieChartData[] = [];
        const dataByBrowser: PieChartData[] = [];
        createPieChartData(events, dataByPageName, 'name');
        createPieChartData(events, dataByOs, 'os');
        createPieChartData(events, dataByBrowser, 'browser');
        
        setData([dataByPageName, dataByOs, dataByBrowser])
    },[events])
    
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#DEB887', '#FF00FF'];

  return (
   <div style={{display: "flex"}}>
    {data.map((data: PieChartData[], index: number) => 
        <PieChart width={420} height={360}>
            <Pie dataKey='value' nameKey='name' data={data} cx={200} cy={200} outerRadius={100} fill="#8884d8" label={true}>
            {
                data.map((cell: PieChartData, index: number) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)
            }
            </Pie>
            <Legend/>
        </PieChart>
    )}
   </div>
  );
};

export default PieCharts