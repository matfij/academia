import { useState } from 'react';
import { LinearChart, LinearChartProps } from './charts/linear-chart';

export const Dashboard = () => {
    const [lineChartData, setLineChartData] = useState<LinearChartProps>({
        title: 'Linear Data',
        xLabel: 'time [s]',
        yLabel: 'acceleration [m/s^]',
        x: Array.from({ length: 250 }, (_, i) => i),
        y: Array.from({ length: 250 }, (_, i) => i + 2 * Math.sin(i)),
    });

    const extendLineChartData = () => {
        setLineChartData((prev) => ({
            ...prev,
            x: [...prev.x, prev.x[prev.x.length - 1] + 1],
            y: [...prev.y, prev.x[prev.y.length - 1] + 2 * Math.sin(prev.y[prev.y.length - 1])],
        }));
        console.log(lineChartData.y[lineChartData.y.length - 1]);
    };

    return (
        <div className="dashboardWrapper">
            <h1 style={{ margin: '1rem' }}>Dashboard</h1>
            <LinearChart {...lineChartData} />
            <button onClick={extendLineChartData}>Extend</button>
        </div>
    );
};
