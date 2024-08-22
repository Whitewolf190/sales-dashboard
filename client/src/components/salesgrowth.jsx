import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import '../styles/salesGrowth.css'
import {
    Chart,
    LineElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const SalesGrowthChart = () => {
    const chartRef = useRef(null); 
    const [chart, setChart] = useState(null); 
    const [isChartRendered, setIsChartRendered] = useState(false);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/charts/sales-growth-rate`)
            .then((response) => {
                const data = response.data || [];
                // console.log(data);

                const labels = data.map((item) => `${item.year}-${item.month}`);
                const salesGrowthData = data.map((item) => item.growthRate);

                // if (chart) {
                //   chart.destroy(); // Destroy the previous chart instance
                // }

                const ctx = chartRef.current.getContext("2d");
                const newChart = new Chart(ctx, {
                    type: "line", 
                    data: {
                        labels,
                        datasets: [
                            {
                                label: "Sales Growth Rate (%)",
                                data: salesGrowthData,
                                backgroundColor: "rgba(153, 102, 255, 0.2)",
                                borderColor: "rgba(153, 102, 255, 1)",
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "bottom",
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        return `Growth Rate: ${tooltipItem.raw.toFixed(2)}%`;
                                    },
                                },
                            },
                        },
                    },
                });

                setChart(newChart);
                setIsChartRendered(true);
            })
            .catch((error) => console.error("API Error:", error));
    }, [chart]);

    return (
        <div  className="sales-growth" >
            <canvas ref={chartRef} />
            {!chart && <p>Loading...</p>}
            {isChartRendered && <p style={{ marginTop: "35px" }}>Sales Growth Rate</p>}
        </div>
    );
};

export default SalesGrowthChart;
