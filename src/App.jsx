import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./assets/components/Navbar/Navbar.jsx"; // Exemple de Navbar
import LoginPage from "./assets/Pages/Login/Login.jsx"; // Exemple de LoginPage
import MarketPage from "./assets/Pages/Home/Home.jsx"; // Une autre page

const App = () => {
  return (
    <Router>
      <Navbar /> {/* La Navbar est affichée sur toutes les pages */}
      <Routes>
        <Route path="/market" element={<MarketPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
