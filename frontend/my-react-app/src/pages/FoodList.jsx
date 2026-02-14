import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

/* =========================
   IMPORT ASSETS
========================= */
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";

export default function Home() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState("default");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [slide, setSlide] = useState(0);
  const [user, setUser] = useState(null); // logged in user
  const [paymentMethod, setPaymentMethod] = useState(""); // demo payment selection

  const slides = [img1, img2, img3, img4];

  /* =========================
     SLIDER EFFECT
========================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  /* =========================
     FETCH FOOD ITEMS & ORDERS
========================= */
  useEffect(() => {
    axios
      .get("/api/food-items/")
      .then((res) => setFoodItems(res.data))
      .catch((err) => console.error("Error fetching food items:", err));

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = () => {
    axios
      .get("http://127.0.0.1:8000/order-items/")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching recent orders:", err));
  };

  /* =========================
     CART FUNCTIONS
========================= */
  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    setCart(cart.filter((c) => c.id !== item.id));
  };

  const changeQuantity = (item, delta) => {
    setCart(
      cart.map((c) =>
        c.id === item.id
          ? { ...c, quantity: Math.max(1, c.quantity + delta) }
          : c
      )
    );
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price_per_person * item.quantity,
    0
  );

  /* =========================
     DEMO PAYMENT & ORDER LOGIC
========================= */
  const handleDemoPayment = async () => {
    if (!user || cart.length === 0 || !paymentMethod) return;

    try {
      // 1️⃣ Create order
      const orderRes = await axios.post("/api/orders/", {
        customer: user.id,
        event_type: "other",
        event_date: new Date().toISOString().split("T")[0],
        number_of_people: cart.reduce((sum, i) => sum + i.quantity, 0),
        budget: totalPrice,
      });
      const orderId = orderRes.data.id;

      // 2️⃣ Post order items to backend API
      for (const item of cart) {
        await axios.post("http://127.0.0.1:8000/order-items/", {
          order: orderId,
          food_name: item.name,
          quantity: item.quantity,
          price_per_person: item.price_per_person,
        });
      }

      // 3️⃣ Simulate demo payment (no real money)
      await axios.post("/api/payments/", {
        order: orderId,
        amount: totalPrice,
        payment_method: paymentMethod,
      });

      // 4️⃣ Fetch latest orders
      fetchRecentOrders();

      // 5️⃣ Reset
      setCart([]);
      setPaymentMethod("");
      setPage("orders");
    } catch (error) {
      console.error("Demo payment failed:", error);
    }
  };

  /* =========================
     JSX
========================= */
  return (
    <div className={`app ${theme}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h3>🍽 Taste Order</h3>
        <button onClick={() => setPage("home")}>🏠 Home</button>
        <button onClick={() => setPage("foods")}>🍔 Food List</button>
        <button onClick={() => setPage("cart")}>🛒 Cart</button>
        <button onClick={() => setPage("payment")}>💳 Payment</button>
        <button onClick={() => setPage("orders")}>📜 Recent Orders</button>
        <button onClick={() => setPage("about")}>ℹ About</button>
        <button onClick={() => setPage("settings")}>⚙ Settings</button>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="header">
          <h1>Taste Order System</h1>
          <p>
            {user
              ? `Welcome, ${user.username}`
              : "Fast • Simple • Learning Project"}
          </p>
        </header>

        <section className="content">
          {/* HOME */}
          {page === "home" && (
            <div
              className="slider"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${slides[slide]})`,
                height: "300px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
              }}
            />
          )}

          {/* FOOD LIST */}
          {page === "foods" && (
            <div className="food-list">
              <h2>Food List</h2>
              {foodItems.length === 0 ? (
                <p>Loading food items...</p>
              ) : (
                <div
                  className="grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "15px",
                  }}
                >
                  {foodItems.map((item) => (
                    <div
                      key={item.id}
                      className="food-card"
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                      }}
                    >
                      <h3>{item.name}</h3>
                      <p>${item.price_per_person}</p>
                      <p>{item.description}</p>
                      <div className="cart-controls">
                        <button onClick={() => addToCart(item)}>Add</button>
                        {cart.find((c) => c.id === item.id) && (
                          <span style={{ marginLeft: "10px" }}>
                            Qty: {cart.find((c) => c.id === item.id).quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CART */}
          {page === "cart" && (
            <>
              <h2>Your Cart</h2>
              {cart.length === 0 && <p>No items in cart</p>}
              {cart.map((c) => (
                <div
                  key={c.id}
                  className="cart-item"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                  }}
                >
                  <span>
                    {c.name} – ${c.price_per_person} x {c.quantity}
                  </span>
                  <div>
                    <button onClick={() => changeQuantity(c, -1)}>-</button>
                    <button onClick={() => changeQuantity(c, 1)}>+</button>
                    <button onClick={() => removeFromCart(c)}>Remove</button>
                  </div>
                </div>
              ))}
              {cart.length > 0 && (
                <p style={{ fontWeight: "bold" }}>Total: ${totalPrice.toFixed(2)}</p>
              )}
              {cart.length > 0 && (
                <button className="btn" onClick={() => setPage("payment")}>
                  Proceed to Payment
                </button>
              )}
            </>
          )}

          {/* PAYMENT (DEMO) */}
          {page === "payment" && (
            <>
              <h2>Demo Payment</h2>
              <p style={{ color: "gray", fontStyle: "italic" }}>
                Select a payment method (demo only, no real money)
              </p>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ padding: "5px", marginBottom: "10px" }}
              >
                <option value="">-- Select payment method --</option>
                <option value="mobile">Mobile Money (Demo)</option>
                <option value="bank">Bank (Demo)</option>
                <option value="control">Control Number (Demo)</option>
              </select>
              <br />
              <button
                className="btn"
                onClick={handleDemoPayment}
                disabled={!paymentMethod}
                style={{ marginTop: "10px" }}
              >
                Confirm Demo Payment
              </button>
            </>
          )}

          {/* ORDERS */}
          {page === "orders" && (
            <>
              <h2>Recent Orders</h2>
              {orders.length === 0 && <p>No orders yet</p>}
              {orders.map((o, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <p>
                    <strong>{o.food_name}</strong> × {o.quantity}
                  </p>
                  <p>Price per person: ${o.price_per_person}</p>
                  <p>
                    Payment (demo):{" "}
                    <strong>{o.payment_method || "N/A"}</strong>
                  </p>
                </div>
              ))}
            </>
          )}

          {/* ABOUT */}
          {page === "about" && (
            <p>
              Taste Order System is a learning project that allows users to
              browse food, place orders, and simulate payments using modern web
              technologies.
            </p>
          )}

          {/* SETTINGS */}
          {page === "settings" && (
            <>
              <h2>Theme Settings</h2>
              <button className="btn" onClick={() => setTheme("light")}>
                Light
              </button>
              <button className="btn" onClick={() => setTheme("default")}>
                Default
              </button>
              <button className="btn" onClick={() => setTheme("dark")}>
                Dark
              </button>
            </>
          )}
        </section>

        <footer className="footer">
          📧 rebekampinzile@gmail.com | ☎ 0692444741 <br />
          © {new Date().getFullYear()} Taste Order System
        </footer>
      </div>
    </div>
  );
}
