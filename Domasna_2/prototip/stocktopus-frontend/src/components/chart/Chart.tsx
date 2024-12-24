import React, { useEffect, useState, useRef } from 'react';
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
import { StockIndicatorsDTO } from "../../model/dto/stockIndicatorsDTO.ts";
import { getStockById } from "../../service/stockService.ts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
    data: StockIndicatorsDTO[];
}

const Chart: React.FC<Props> = ({ data }) => {
    const [stockNames, setStockNames] = useState<{ [key: number]: string }>({});
    const fetchedStockIds = useRef<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStockNames = async () => {
            if (data.length > 0) {
                const names: { [key: number]: string } = { ...stockNames };

                for (const stock of data) {
                    if (!fetchedStockIds.current.has(stock.stockId)) {
                        try {
                            const stockDetails = await getStockById(stock.stockId);
                            names[stock.stockId] = stockDetails.stockName;
                            fetchedStockIds.current.add(stock.stockId);
                        } catch (error) {
                            console.error(`Failed to fetch stock name for ID ${stock.stockId}`, error);
                        }
                    }
                }
                setStockNames(names);
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchStockNames();
    }, [data]);

    const colors = ['rgba(104,75,192)', 'rgba(187,124,72)', 'rgba(54,162,235)', 'rgba(255,206,86)'];
    const backgroundColors = ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'];

    const bestStocks = Array.from(new Set(data.map((item) => item.stockId)))
        .slice(0, 4)
        .map((stockId) => data.find((item) => item.stockId === stockId)!);

    const allDates = Array.from(new Set(data.map((item) => item.date))).sort();

    const datasets = bestStocks.map((stock, index) => {
        const stockData = allDates.map((date) => {
            const match = data.find((item) => item.stockId === stock.stockId && item.date === date);
            return match ? match.sma50 : null;
        });

        return {
            label: stockNames[stock.stockId]
                ? `Stock ${stockNames[stock.stockId]} - SMA50`
                : `Stock ${stock.stockId} - SMA50`,
            data: stockData,
            borderColor: colors[index],
            backgroundColor: backgroundColors[index],
            tension: 0.4,
            borderWidth: 2,
        };
    });

    const chartData = {
        labels: allDates.map((date) => new Date(date).toLocaleDateString()),
        datasets: datasets,
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Stock Indicators - SMA50 for Top Stocks',
            },
        },
    };

    if (loading) {
        return <div>Loading stock data...</div>;
    }

    return <Line data={chartData} options={options} />;
};

export default Chart;
