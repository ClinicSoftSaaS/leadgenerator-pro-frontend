import { useState } from "react";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [city, setCity] = useState("");
  const [speciality, setSpeciality] = useState("");

  const openGoogleMaps = () => {
    if (!city || !speciality) {
      alert("Please enter city and speciality");
      return;
    }

    const query = `${speciality} in ${city}`;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(url, "_blank");
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.title}>Lead Generator</h1>

        <div style={styles.card}>
          <input
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Enter Speciality (e.g Dentist, Gym, Salon)"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            style={styles.input}
          />

          <button onClick={openGoogleMaps} style={styles.button}>
            Open Google Maps
          </button>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "12px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};