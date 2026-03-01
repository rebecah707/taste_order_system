import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        setError(JSON.stringify(data));
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ffffff, #f0f0f0)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          maxWidth: "1200px",
          height: "80%",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        {/* Left branding side */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #6a11cb, #2575fc)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontSize: "36px",
            fontWeight: "bold",
          }}
        >
          Taste Order System
        </div>

        {/* Right form side */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>Register</h2>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", marginBottom: "15px" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", marginBottom: "15px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", marginBottom: "15px" }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ padding: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", marginBottom: "20px" }}
          />

          <button
            type="submit"
            disabled={loading}
            onClick={handleRegister}
            style={{
              padding: "15px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "20px",
            }}
            onMouseOver={(e) => (e.target.style.filter = "brightness(1.1)")}
            onMouseOut={(e) => (e.target.style.filter = "brightness(1)")}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p style={{ textAlign: "center", color: "#666" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2575fc", textDecoration: "none" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
