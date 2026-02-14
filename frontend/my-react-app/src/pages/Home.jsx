import React, { useState, useEffect } from "react";
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
  const [slide, setSlide] = useState(0);
  const [user, setUser] = useState(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mobileNetwork, setMobileNetwork] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const slides = [img1, img2, img3, img4];

  // Slider fade effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
     PLACE ORDER & PAYMENT
     ========================= */
  const confirmPayment = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    if (!paymentMethod) return alert("Select a payment method!");
    if (paymentMethod === "mobile") {
      if (!mobileNetwork || !mobileNumber)
        return alert("Enter mobile network and number!");
    }
    if (paymentMethod === "bank") {
      if (!bankName || !bankAccount)
        return alert("Enter bank name and account number!");
    }

    const order = {
      date: new Date(),
      items: cart,
      payment: {
        method: paymentMethod,
        mobileNetwork,
        mobileNumber,
        bankName,
        bankAccount,
      },
      total: totalPrice,
    };

    setOrders([...orders, order]);
    setCart([]);
    setPaymentMethod("");
    setMobileNetwork("");
    setMobileNumber("");
    setBankName("");
    setBankAccount("");
    setPage("orders");

    alert("Payment confirmed! Order placed successfully.");
  };

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
          <p>{user ? `Welcome, ${user.username}` : "Fast • Simple • Learning Project"}</p>
        </header>

        <section className="content">
          {/* HOME */}
          {page === "home" && (
            <div className="slider-container">
              {slides.map((img, idx) => (
                <div
                  key={idx}
                  className={`slider fade ${slide === idx ? "active" : ""}`}
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            </div>
          )}

          {/* FOOD LIST */}
          {page === "foods" && (
            <div className="food-list">
              <h2>Add Your Food Item</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = e.target.name.value.trim();
                  const price = parseFloat(e.target.price.value);
                  const desc = e.target.description.value.trim();
                  if (!name || !price) return;
                  const newItem = {
                    id: Date.now(),
                    name,
                    price_per_person: price,
                    description: desc,
                    quantity: 1,
                  };
                  addToCart(newItem);
                  e.target.reset();
                }}
              >
                <input type="text" name="name" placeholder="Food Name" required />
                <input type="number" name="price" placeholder="Price" step="0.01" required />
                <input type="text" name="description" placeholder="Description (optional)" />
                <button className="btn" type="submit">Add to Cart</button>
              </form>
            </div>
          )}

          {/* CART */}
          {page === "cart" && (
            <>
              <h2>Your Cart</h2>
              {cart.length === 0 && <p>No items in cart</p>}
              {cart.map((c) => (
                <div key={c.id} className="cart-item">
                  <span>{c.name} – ${c.price_per_person} x {c.quantity}</span>
                  <div>
                    <button onClick={() => changeQuantity(c, -1)}>-</button>
                    <button onClick={() => changeQuantity(c, 1)}>+</button>
                    <button onClick={() => removeFromCart(c)}>Remove</button>
                  </div>
                </div>
              ))}
              {cart.length > 0 && <p>Total: ${totalPrice.toFixed(2)}</p>}
              {cart.length > 0 && (
                <button className="btn" onClick={() => setPage("payment")}>
                  Proceed to Payment
                </button>
              )}
            </>
          )}

          {/* PAYMENT */}
          {page === "payment" && (
            <div className="payment-page">
              <h2>Payment Method</h2>
              <div>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="mobile"
                    checked={paymentMethod === "mobile"}
                    onChange={() => setPaymentMethod("mobile")}
                  /> Mobile Money
                </label>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                  /> Bank
                </label>
              </div>

              {paymentMethod === "mobile" && (
                <div className="payment-mobile">
                  <select value={mobileNetwork} onChange={(e) => setMobileNetwork(e.target.value)}>
                    <option value="">Select Network</option>
                    <option value="Airtel">Airtel</option>
                    <option value="Tigo">Tigo</option>
                    <option value="Halotel">Halotel</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="payment-bank">
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              )}

              <button className="btn" style={{ marginTop: "10px" }} onClick={confirmPayment}>
                Confirm Payment
              </button>
            </div>
          )}

          {/* ORDERS */}
          {page === "orders" && (
            <>
              <h2>Recent Orders</h2>
              {orders.length === 0 && <p>No orders yet</p>}
              {orders.map((o, i) => (
                <div key={i} className="order-item">
                  <p>Order {i + 1} – {o.items.length} items – {new Date(o.date).toLocaleString()} – Total: ${o.total.toFixed(2)}</p>
                  <p>Payment Method: {o.payment.method}</p>
                  {o.payment.method === "mobile" && (
                    <p>Network: {o.payment.mobileNetwork}, Number: {o.payment.mobileNumber}</p>
                  )}
                  {o.payment.method === "bank" && (
                    <p>Bank: {o.payment.bankName}, Account: {o.payment.bankAccount}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {/* ABOUT */}
          {page === "about" && (
            <p>
              Taste Order System is a learning project that allows users to browse
              food, place orders, and simulate payments using modern web technologies.
            </p>
          )}

          {/* SETTINGS */}
          {page === "settings" && (
            <>
              <h2>Theme Settings</h2>
              <button className="btn" onClick={() => setTheme("light")}>Light</button>
              <button className="btn" onClick={() => setTheme("default")}>Default</button>
              <button className="btn" onClick={() => setTheme("dark")}>Dark</button>
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
