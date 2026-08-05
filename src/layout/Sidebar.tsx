import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  console.log("SIDEBAR COMPONENT IS RENDERING");
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside
      style={{
        width: "256px",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "30px" }}>
        Customer360
      </h1>

      <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <NavLink to="/dashboard" style={{ color: "white" }}>
          Dashboard
        </NavLink>

        <NavLink to="/customers" style={{ color: "white" }}>
          Customers
        </NavLink>

        <NavLink to="/settings" style={{ color: "white" }}>
          Settings
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            marginTop: "8px",
            width: "100%",
            padding: "12px",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}