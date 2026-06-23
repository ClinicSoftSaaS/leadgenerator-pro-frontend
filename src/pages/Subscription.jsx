import { useState } from "react";
import { api } from "../api";

export default function Subscription() {
  const [plan, setPlan] = useState("basic");
  const [transaction, setTransaction] = useState("");

  const token = localStorage.getItem("token");

  const submit = async () => {
    const res = await api.requestSubscription(token, {
      plan,
      transaction_id: transaction,
    });

    if (res.ok) {
      alert("Payment submitted for review");
    } else {
      alert("Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💳 Subscription (JazzCash Manual)</h2>

      <p>
        Send payment to:
        <br />
        <b>03226813940</b>
        <br />
        Account Name: Shahnaz Akhtar
      </p>

      <select onChange={(e) => setPlan(e.target.value)}>
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
      </select>

      <input
        placeholder="Transaction ID"
        onChange={(e) => setTransaction(e.target.value)}
      />

      <button onClick={submit}>Submit Payment</button>
    </div>
  );
}