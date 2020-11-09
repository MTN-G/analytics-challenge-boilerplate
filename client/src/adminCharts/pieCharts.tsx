import { Label } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend} from "recharts";
import { Event } from '../models/event';

type PieChartData = {
    name: string,
    value: number
};

enum Key {
    name = "name",
    browser = "browser",
    os = "os"
};


function createPieChartData (data: Event[], newData: PieChartData[], keyName: Key): void {
    data.forEach((event: Event) => {
        if (newData.some((obj: PieChartData) => obj.name === event[keyName])) {
            newData.forEach((obj: PieChartData) => {
                if (obj.name === event[keyName]) obj.value++;
            })
        } else newData.push({name: event[keyName], value: 1})
    })
};

const PieCharts: React.FC<{events: Event[]}> = ({events}) => {

    const [data, setData] = useState<PieChartData[][]>([]);

    useEffect(() => {
        const dataByPageName: PieChartData[] = [];
        const dataByOs: PieChartData[] = [];
        const dataByBrowser: PieChartData[] = [];
        createPieChartData(events, dataByPageName, Key.name);
        createPieChartData(events, dataByOs, Key.os);
        createPieChartData(events, dataByBrowser, Key.browser);
        
        setData([dataByPageName, dataByOs, dataByBrowser]);
    },[events]);
    
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#DEB887', '#FF00FF'];

    return (
   <div>
    {data.map((data: PieChartData[], index: number) => 
        <PieChart width={420} height={360} key={`${index}-Pie`}>
            <Pie dataKey='value' nameKey='name' data={data} cx={200} cy={200} outerRadius={100} label={true}>
            {
                data.map((cell: PieChartData, index: number) => 
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]}>
                        <p style={{zIndex: 100}}>{cell.name}</p>
                    </Cell> )
            }
            </Pie>
            <Legend/>
        </PieChart>
    )};
   </div>
  );
};

export default PieCharts;