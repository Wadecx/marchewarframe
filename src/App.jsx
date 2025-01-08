import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./assets/components/Navbar/Navbar.jsx"; // Exemple de Navbar
import LoginPage from "./assets/Pages/Login/Login.jsx"; // Exemple de LoginPage
import MarketPage from "./assets/Pages/Home/Home.jsx"; // Une autre page
import RivenPage from "./assets/Pages/Riven/Riven.jsx"; // Une autre page

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MarketPage />} />
        <Route path="/riven" element={<RivenPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
