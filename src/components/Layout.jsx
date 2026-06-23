import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.content}>{children}</div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Inter, Arial",
  },
  content: {
    padding: "25px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
};