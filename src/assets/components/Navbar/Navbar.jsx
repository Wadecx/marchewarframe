import React from "react";
import "./navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import { RiLoginBoxFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="leftSide">
        <h2>Marché Warframe</h2>
      </div>

      <div className="rightSide">
        <ul>
          <li>
            <Link to={"/"}>
              <FaShoppingCart /> Market
            </Link>
          </li>
          <li>
            <Link to={"/riven"}>Rivens</Link>
          </li>
          <li>
            <Link to={"/login"}>
              <RiLoginBoxFill /> Sign In
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
