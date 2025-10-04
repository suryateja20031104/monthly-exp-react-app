import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthGraph = () => {
  const [month, setMonth] = useState("");
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(""); // For no data or fetch errors

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!month) return;

    const [year, monthNumber] = month.split("-");

    try {
      const res = await fetch(`https://monthly-exp-backend.onrender.com/getMonthly/${monthNumber}/${year}`);
      const result = await res.json();

      if (res.ok && result.data && Object.keys(result.data).length > 0) {
        const monthData = result.data;
        const days = Object.keys(monthData).sort((a, b) => a - b);

        const dailyTotals = days.map((day) => {
          const dayObj = monthData[day];
          return (dayObj.morning || 0) + (dayObj.afternoon || 0) + (dayObj.evening || 0) + (dayObj.night || 0);
        });

        setData({
          labels: days,
          datasets: [
            {
              label: "Daily Expenditure",
              data: dailyTotals,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.3, // smooth line
              pointRadius: 5,
            },
          ],
        });

        const monthTotal = dailyTotals.reduce((acc, val) => acc + val, 0);
        setTotal(monthTotal);
      } else {
        setData(null);
        setTotal(0);
        setError(`No data found for ${monthNumber}-${year}`);
      }
    } catch (err) {
      console.error(err);
      setData(null);
      setTotal(0);
      setError("Error fetching data");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">Monthly Expenditure Graph</h1>

      <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center mb-4">
        <input
          type="month"
          className="form-control w-50 mx-auto mb-3"
          value={month}
          onChange={handleMonthChange}
          required
        />
        <button type="submit" className="btn btn-primary px-4">
          Show Graph
        </button>
      </form>

      {error && <h4 className="text-center text-danger mt-4">{error}</h4>}

      {data && (
        <>
          <div className="mb-4">
            <Line
              data={data}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: {
                  y: { beginAtZero: true },
                  x: { title: { display: true, text: "Day of Month" } },
                },
              }}
            />
          </div>
          <h4 className="text-center">Total for the month: ₹{total}</h4>
        </>
      )}
    </div>
  );
};

export default MonthGraph;
