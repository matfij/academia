import { useState } from 'react';
import { LinearChart, LinearChartProps } from './charts/linear-chart';

export const Dashboard = () => {
    const [lineChartData] = useState<LinearChartProps>({
        title: 'Linear Data',
        xLabel: 'time [s]',
        yLabel: 'acceleration [m/s^]',
        x: Array.from({ length: 250 }, (_, i) => i),
        y: Array.from({ length: 250 }, (_, i) => i + 2 * Math.sin(i)),
    });

    return (
        <div className="dashboardWrapper">
            <h1 style={{ margin: '1rem' }}>Dashboard</h1>
            <LinearChart {...lineChartData} />
        </div>
    );
};
