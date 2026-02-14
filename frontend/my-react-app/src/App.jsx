import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FoodList from "./pages/FoodList";
import Home from "./pages/Home"

function App() {
  return (
    <Router>
      <Routes>
        {/* Default page redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />
        {/*FoodList page*/}
        <Route path="/FoodList" element={<FoodList/>}></Route>
        <Route path="/Home" element={<Home/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
