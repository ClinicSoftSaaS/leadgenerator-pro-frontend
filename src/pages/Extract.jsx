import { useState } from "react";
import Layout from "../components/Layout";
import { extractLead } from "../utils/extractLead";

export default function Extract() {
  const [raw, setRaw] = useState("");
  const [lead, setLead] = useState(null);

  const token = localStorage.getItem("token");

  const handleExtract = () => {
    const data = extractLead(raw);
    setLead(data);
  };

  const handleSave = async () => {
    const res = await fetch("http://127.0.0.1:8000/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lead),
    });

    if (res.ok) {
      alert("Lead saved!");
      setRaw("");
      setLead(null);
    } else {
      alert("Failed to save");
    }
  };

  return (
    <Layout>
      <div className="card">
        <h2>Google Maps Extractor</h2>

        <textarea
          placeholder="Paste Google Maps data here..."
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          style={{ height: "200px", marginTop: "10px" }}
        />

        <div style={{ marginTop: "10px" }}>
          <button onClick={handleExtract} style={{ marginRight: "10px" }}>
            Extract
          </button>

          <button onClick={handleSave} disabled={!lead}>
            Save Lead
          </button>
        </div>

        {lead && (
          <div style={{ marginTop: "20px" }}>
            <h3>Extracted Lead</h3>
            <p><b>Name:</b> {lead.name}</p>
            <p><b>Phone:</b> {lead.phone}</p>
            <p><b>Address:</b> {lead.address}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}