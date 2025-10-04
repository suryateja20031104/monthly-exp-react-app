import { useState } from "react";

const Monthly = () => {
  const [month, setMonth] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!month) return;

    const [year, monthNumber] = month.split("-");

    try {
      const res = await fetch(`http://localhost:5000/getMonthly/${monthNumber}/${year}`);
      const result = await res.json();

      if (res.ok && result.data) {
        setData(result.data);
        setError("");
      } else {
        setData({});
        setError(result.message || "No data found for the selected month.");
      }

      console.log(result);
    } catch (err) {
      console.error("Error fetching data:", err);
      setData({});
      setError("Failed to fetch data. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary fw-bold">
        Monthly Expenditure
      </h1>

      <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
        <div className="card shadow-lg p-4 w-100 w-md-75 w-lg-50">
          <div className="mb-3 text-center">
            <label htmlFor="month" className="form-label fw-semibold">
              Select Month:
            </label>
            <input
              type="month"
              id="month"
              name="month"
              className="form-control mx-auto w-75"
              onChange={handleMonthChange}
              required
            />
          </div>

          <div className="text-center">
            <button className="btn btn-primary px-4 mt-3" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>

      {error ? (
        <h4 className="text-center text-danger mt-5">{error}</h4>
      ) : Object.keys(data).length > 0 ? (
        <div className="mt-5">
          <h3 className="text-center text-success mb-3">
            Expenditure Details for {month}
          </h3>
          <div className="table-responsive">
            <table className="table table-bordered table-hover text-center shadow-sm">
              <thead className="table-primary">
                <tr>
                  <th>Date</th>
                  <th>Morning</th>
                  <th>Afternoon</th>
                  <th>Evening</th>
                  <th>Night</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data).map(([day, values]) => (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>{values.morning}</td>
                    <td>{values.afternoon}</td>
                    <td>{values.evening}</td>
                    <td>{values.night}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Monthly;
