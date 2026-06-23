import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function Leads() {
  const [city, setCity] = useState("");
  const [speciality, setSpeciality] = useState("");

  const [rawText, setRawText] = useState("");
  const [lead, setLead] = useState(null);
  const [leads, setLeads] = useState([]);

  const API = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  // ================= LOAD LEADS =================
  const loadLeads = async () => {
    const res = await fetch(`${API}/leads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // ================= GOOGLE MAPS =================
  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(
        speciality + " in " + city
      )}`,
      "_blank"
    );
  };

  // ================= CLEAN EXTRACT (NO ADDRESS) =================
  const extractLead = () => {
    const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);

    const name = lines[0] || "Unknown";

    let phone = "";
    lines.forEach(l => {
      if (l.includes("+") || l.includes("03")) {
        phone = l;
      }
    });

    // ❌ ADDRESS REMOVED COMPLETELY
    setLead({ name, phone });
  };

  // ================= SAVE =================
  const saveLead = async () => {
    if (!lead) return;

    await fetch(`${API}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lead),
    });

    await loadLeads(); // 🔥 FIX: refresh UI instantly

    setLead(null);
    setRawText("");
  };

  // ================= WHATSAPP =================
  const whatsapp = (phone) =>
    `https://wa.me/${phone.replace(/\D/g, "")}`;

  // ================= DELETE =================
  const deleteLead = (index) => {
    const updated = leads.filter((_, i) => i !== index);
    setLeads(updated);
  };

  // ================= CSV =================
  const exportCSV = () => {
    const csv = [
      "Name,Phone",
      ...leads.map(l => `${l.name},${l.phone}`)
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
  };

  // ================= PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Leads", 10, 10);

    let y = 20;

    leads.forEach((l, i) => {
      doc.text(`${i + 1}. ${l.name} - ${l.phone}`, 10, y);
      y += 10;
    });

    doc.save("leads.pdf");
  };

  return (
    <div style={styles.page}>
      <h2>Google Maps Extractor</h2>

      {/* SEARCH */}
      <div style={styles.card}>
        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
        <input placeholder="Speciality" value={speciality} onChange={e => setSpeciality(e.target.value)} />

        <button onClick={openGoogleMaps} style={styles.btn}>
          Google Maps
        </button>
      </div>

      {/* EXTRACT */}
      <div style={styles.card}>
        <textarea
          placeholder="Paste Google Maps data"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
        />

        <button onClick={extractLead} style={styles.btn}>
          Extract
        </button>

        <button onClick={saveLead} style={styles.btnGreen}>
          Save
        </button>

        {lead && (
          <div style={styles.preview}>
            <b>{lead.name}</b>
            <p>{lead.phone}</p>
          </div>
        )}
      </div>

      {/* EXPORT */}
      <div style={styles.card}>
        <button onClick={exportCSV}>CSV</button>
        <button onClick={exportPDF}>PDF</button>
      </div>

      {/* LEADS */}
      <div style={styles.card}>
        <h3>Leads</h3>

        {leads.map((l, i) => (
          <div key={i} style={styles.leadCard}>
            <b>{l.name}</b>
            <p>{l.phone}</p>

            <a href={whatsapp(l.phone)} target="_blank">
              <button style={styles.btnGreen}>WhatsApp</button>
            </a>

            <button onClick={() => deleteLead(i)} style={styles.btnRed}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: { padding: 20, fontFamily: "Arial", background: "#f5f7fb" },
  card: { background: "#fff", padding: 15, marginBottom: 15, borderRadius: 10 },
  btn: { background: "#4f46e5", color: "#fff", padding: 10 },
  btnGreen: { background: "#22c55e", color: "#fff", padding: 10 },
  btnRed: { background: "#ef4444", color: "#fff", padding: 10 },
  preview: { background: "#eef2ff", padding: 10, marginTop: 10 },
  leadCard: { padding: 10, borderBottom: "1px solid #ddd" },
};