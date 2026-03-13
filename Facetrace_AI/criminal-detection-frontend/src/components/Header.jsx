import { useNavigate } from "react-router-dom";

function Header({ title }) {
  const navigate = useNavigate();

  return (
    <div style={styles.header}>
      <button style={styles.back} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>{title}</h2>
    </div>
  );
}
const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px 20px",
    background: "#1f2937",
    color: "#fff",
  },
  back: {
    padding: "6px 12px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};

export default Header;
