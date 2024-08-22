import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import '../styles/repeatedCustomer.css'

// Register Chart.js components
Chart.register(...registerables);

const CombinedCustomerChart = () => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [isChartRendered, setIsChartRendered] = useState(false); 

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/charts/repeated-customers`)
      .then((response) => {
        const data = response.data || {};
        console.log(data);

        const labels = data.daily.map((item) => item._id);
        const datasets = [
          {
            label: "Daily Repeat Customers",
            data: data.daily.map((item) => item.count),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
          },
          {
            label: "Monthly Repeat Customers",
            data: data.monthly.map((item) => item.count),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: false,
          },
          {
            label: "Quarterly Repeat Customers",
            data: data.quarterly.map((item) => item.count),
            borderColor: "rgba(255, 206, 86, 1)",
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            fill: false,
          },
          {
            label: "Yearly Repeat Customers",
            data: data.yearly.map((item) => item.count),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: false,
          },
        ];

        setChartData({
          labels,
          datasets,
        });
        setIsChartRendered(true);
      })
      .catch((error) => console.error("Error fetching customer data:", error));
  }, []);

  useEffect(() => {
    if (chartData) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: chartData,
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
                  return `Count: ${tooltipItem.raw}`;
                },
              },
            },
          },
        },
      });
    }
  }, [chartData]);

  return (
    <div className="repeated-customer">
      <canvas ref={chartRef}></canvas>
      {!chartData && <p>Loading...</p>}
      {isChartRendered && <p style={{ marginTop: "35px" }}> Number of Repeat Customers</p>}
    </div>
  );
};

export default CombinedCustomerChart;
