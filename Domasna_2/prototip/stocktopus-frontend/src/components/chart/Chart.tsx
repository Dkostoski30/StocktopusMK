import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {StockIndicatorsDTO} from "../../model/dto/stockIndicatorsDTO.ts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface props {
    data: StockIndicatorsDTO[];
}

const Chart: React.FC<props> = ({ data }) => {
    const chartData = {
        labels: data.map((item) => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: 'SMA50',
                data: data.map((item) => item.sma50),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Stock Indicators - SMA50',
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default Chart;
