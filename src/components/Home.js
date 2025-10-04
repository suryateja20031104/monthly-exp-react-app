import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [slot, setSlot] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  // Get current date details
  const today = new Date();
  const date = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-indexed
  const year = today.getFullYear();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slot || !amount) {
      setMessage("Please select a slot and enter an amount.");
      return;
    }

    try {
      const res = await axios.patch(`https://monthly-exp-backend.onrender.com/updateExpenditure`, {
        year,
        month,
        date,
        slot,
        amount: Number(amount),
      });

      setMessage(res.data.message || "Data updated successfully!");
      setSlot("");
      setAmount("");
    } catch (error) {
      console.error(error);
      setMessage("Error updating data");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Daily Expenditure</h1>

      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label className="form-label fw-bold">Select Time Slot:</label>
          <select
            className="form-select"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Enter Amount:</label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter expenditure amount"
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Date:</label>
          <input
            type="text"
            className="form-control"
            value={`${date}-${month}-${year}`}
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Submit
        </button>
      </form>

      {message && (
        <div className="alert alert-info text-center mt-3">{message}</div>
      )}
    </div>
  );
};

export default Home;
