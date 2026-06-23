import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>LeadPro</div>

      <div style={styles.links}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/leads">Leads</Link>
        <Link to="/extract">Extractor</Link>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </span>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#ffffff",
    color: "#111",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  left: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "#4f46e5",
  },

  links: {
    display: "flex",
    gap: "15px",
  },
};