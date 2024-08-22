import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import '../styles/totalSales.css'
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
import ClipLoader from "react-spinners/ClipLoader";
const TotalSalesChart = () => {
  const chartRef = useRef(null); 
  const [chart, setChart] = useState(null); 
  const [isChartRendered, setIsChartRendered] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/charts/total-sales`)
      .then((response) => {
        const data = response.data || [];

        const labels = data.map(
          (item) => `${item._id.year}-${item._id.month}-${item._id.day}`
        );
        const salesData = data.map((item) => item.totalSales);

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Total Sales",
                data: salesData,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
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
                    return `Sales: $${tooltipItem.raw}`;
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
  }, []);

  return (
    <div
      className="total-sales"
      
    >
      <canvas ref={chartRef} />
      {!chart && <p>Loading..</p>}
      {isChartRendered && <p style={{ marginTop: "35px" }}>Total Sales Over Time</p>}
    </div>
  );
};

export default TotalSalesChart;
