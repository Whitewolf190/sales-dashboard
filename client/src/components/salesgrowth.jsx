import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Chart,
    LineElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const SalesGrowthChart = () => {
    const chartRef = useRef(null); // Ref for the canvas element
    const [chart, setChart] = useState(null); // To store the chart instance
    const [isChartRendered, setIsChartRendered] = useState(false); // State to track if chart is rendered

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
                    type: "line", // Type of chart
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

                setChart(newChart); // Set the new chart instance
                setIsChartRendered(true); // Set the new chart instance
            })
            .catch((error) => console.error("API Error:", error));
    }, [chart]);

    return (
        <div style={{
            background:'white',
            width: "990px",
            height: "400px",
            border: "2px solid lightgrey",
            borderRadius: "10px",
            padding: "20px",
            marginBottom:'45px',
            textAlign:'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}>
            {" "}
            {/* Set the size of the chart */}
            <canvas ref={chartRef} />
            {!chart && <p>Loading...</p>}
            {isChartRendered && <p style={{ marginTop: "35px" }}>Sales Growth Rate</p>}
        </div>
    );
};

export default SalesGrowthChart;
