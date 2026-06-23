import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function LeadGenerator() {
  const API = import.meta.env.VITE_API_URL;

  const [city, setCity] = useState("");
  const [speciality, setSpeciality] = useState("");

  const [rawText, setRawText] = useState("");
  const [lead, setLead] = useState(null);
  const [leads, setLeads] = useState([]);

  const token = localStorage.getItem("token");

  // ================= LOAD LEADS =================
  useEffect(() => {
    if (!token) return;

    const loadLeads = async () => {
      try {
        const res = await fetch(`${API}/leads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("LOAD ERROR:", err);
        setLeads([]);
      }
    };

    loadLeads();
  }, [token]);

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // ================= GOOGLE MAPS =================
  const openGoogleMaps = () => {
    if (!city && !speciality) return;

    const q = `${speciality} in ${city}`;
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(q)}`,
      "_blank"
    );
  };

  // ================= EXTRACT LEAD =================
  const extractLead = () => {
    const lines = rawText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const name = lines[0] || "";
    let phone = "";

    const phoneRegex =
      /(\+?\d{1,4}[\s\-()]?)?(\(?\d{2,5}\)?[\s\-]?)?\d[\d\s\-]{6,}/;

    for (const l of lines) {
      const match = l.match(phoneRegex);
      if (match) {
        phone = match[0].trim();
        break;
      }
    }

    const address = lines
      .filter(
        (l) =>
          l.toLowerCase().includes("road") ||
          l.toLowerCase().includes("street") ||
          l.toLowerCase().includes("pakistan") ||
          l.toLowerCase().includes("lahore") ||
          l.toLowerCase().includes("okara")
      )
      .join(" ")
      .slice(0, 200);

    setLead({ name, phone, address });
    setRawText("");
  };

  // ================= SAVE LEAD (FIXED) =================
  const saveLead = async () => {
    if (!lead) return;

    try {
      const res = await fetch(`${API}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lead),
      });

      const response = await res.json();

      if (!res.ok) {
        alert(response.detail || "Failed to save lead");
        return;
      }

      // ✅ FIX: correct backend structure
      const newLead = response.lead || response;

      setLeads((prev) => [newLead, ...prev]);

      setLead(null);
      setRawText("");
      setCity("");
      setSpeciality("");
    } catch (err) {
      console.log("SAVE ERROR:", err);
      alert("Failed to save lead");
    }
  };

  // ================= WHATSAPP =================
  const whatsapp = (phone) => {
    let num = phone?.replace(/\D/g, "") || "";

    if (num && !num.startsWith("92")) {
      num = "92" + num;
    }

    return `https://wa.me/${num}`;
  };

  // ================= CSV EXPORT =================
  const exportCSV = () => {
    const csv = [
      "Name,Phone,Address",
      ...leads.map(
        (l) =>
          `"${l.name || ""}","${l.phone || ""}","${l.address || ""}"`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  // ================= PDF EXPORT =================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("LeadFlow CRM - Leads Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Name", "Phone", "Address"]],
      body: leads.map((l) => [
        l.name || "",
        l.phone || "",
        l.address || "",
      ]),
    });

    doc.save("leads.pdf");
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>LeadFlow CRM</h2>
        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <div style={styles.card}>
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Speciality"
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          style={styles.input}
        />

        <button onClick={openGoogleMaps} style={styles.btn}>
          Google Maps
        </button>
      </div>

      {/* EXTRACT */}
      <div style={styles.card}>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={extractLead} style={styles.btn}>
          Extract
        </button>

        <button onClick={saveLead} style={styles.btnGreen}>
          Save Lead
        </button>

        {lead && (
          <div style={styles.preview}>
            <p><b>{lead.name}</b></p>
            <p>{lead.phone}</p>
          </div>
        )}
      </div>

      {/* EXPORT */}
      <div style={styles.card}>
        <button onClick={exportCSV} style={styles.btn}>
          CSV
        </button>

        <button onClick={exportPDF} style={styles.btnGreen}>
          PDF
        </button>
      </div>

      {/* LEADS LIST */}
      <div style={styles.card}>
        {leads.length === 0 ? (
          <p>No leads</p>
        ) : (
          leads.map((l, index) => (
            <div key={l.id || index} style={styles.lead}>
              <b>{l.name}</b>
              <p>{l.phone}</p>

              <a href={whatsapp(l.phone)} target="_blank" rel="noreferrer">
                <button style={styles.btnGreen}>WhatsApp</button>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    padding: 20,
    fontFamily: "Arial",
    background: "#f5f7ff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  card: {
    background: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 5,
  },
  textarea: {
    width: "100%",
    height: 120,
  },
  btn: {
    background: "#4f46e5",
    color: "#fff",
    padding: 10,
    border: "none",
    marginRight: 5,
    cursor: "pointer",
  },
  btnGreen: {
    background: "green",
    color: "#fff",
    padding: 10,
    border: "none",
    marginRight: 5,
    cursor: "pointer",
  },
  lead: {
    borderBottom: "1px solid #ddd",
    padding: 10,
  },
  preview: {
    marginTop: 10,
  },
  logout: {
    background: "black",
    color: "#fff",
    padding: 10,
    border: "none",
    cursor: "pointer",
  },
};