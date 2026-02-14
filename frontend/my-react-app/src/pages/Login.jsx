import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful");
        navigate("/Home");
      } else {
        setError(data.non_field_errors || "Login failed");
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
        {/* Left image/branding side */}
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
          <h2 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>Login</h2>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "16px",
              marginBottom: "20px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            onClick={handleLogin}
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
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={{ textAlign: "center", color: "#666" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#2575fc", textDecoration: "none" }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
