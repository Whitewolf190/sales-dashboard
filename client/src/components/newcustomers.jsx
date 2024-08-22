import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto"; // Import Chart.js
import axios from "axios";
const NewCustomersChart = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/charts/new-customers`)
      .then((response) => {
        const data = response.data || [];
        const labels = data.map(
          (item) => `${item.year}-${item.month}-${item.day}`
        );
        const newCustomerData = data.map((item) => item.count);

        // if (chart) {
        //   chart.destroy(); // Destroy the previous chart instance before creating a new one
        // }

        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "line", // You can change this to 'line' or other types
          data: {
            labels,
            datasets: [
              {
                label: "New Customers",
                data: newCustomerData,
                backgroundColor:'white',
                // backgroundColor: "rgba(255, 159, 64, 0.2)",
                borderColor: "rgba(255, 159, 64, 1)",
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
                    return `New Customers: ${tooltipItem.raw}`;
                  },
                },
              },
            },
          },
        });

        setChart(newChart); // Store the chart instance in the state
      })
      .catch((error) => {
        console.error("Error fetching new customers data:", error);
      });
  }, []);

  return (
    <div style={{
        width: "90% ",
        height: "400px",
        border: "2px solid lightgrey",
        borderRadius: "10px",
        padding: "20px",
        marginBottom:'50px',
        textAlign:'center',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        marginLeft:'70px',
        textAlignLast:'center'
      }}>
      <canvas ref={chartRef} />{" "}
      {/* Canvas element where Chart.js will render the chart */}
      {chart && <p style={{ marginTop: "35px" }}>New Customers Added Over Time</p>}
      {!chart && <p>Loading...</p>}
    </div>
  );
};

export default NewCustomersChart;
