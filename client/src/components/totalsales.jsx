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

const TotalSalesChart = () => {
  const chartRef = useRef(null); // Ref for the canvas element
  const [chart, setChart] = useState(null); // To store the chart instance
  const [isChartRendered, setIsChartRendered] = useState(false); // State to track if chart is rendered

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

        setChart(newChart); // Set the new chart instance
        setIsChartRendered(true); // Indicate that the chart has been rendered
      })
      .catch((error) => console.error("API Error:", error));
  }, []);

  return (
    <div
      className="totalSales"
      style={{
        width: "97.9%",
        height: "500px",
        border: "2px solid lightgrey",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "50px",
        textAlign: "center",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
      }}
    >
      <canvas ref={chartRef} />
      {!chart && <p>Loading..</p>}
      {isChartRendered && <p style={{ marginTop: "35px" }}>Total Sales Over Time</p>}
    </div>
  );
};

export default TotalSalesChart;
