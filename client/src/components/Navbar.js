import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css"

//logout the user, remove the token from the session storage
const logout = () => {
  sessionStorage.clear("key");
}

//clicking the logo, if user logged in then it goes to the dashboard
const logo = () => {
  if (sessionStorage.getItem("key") != null) {
    return "/dashboard"
  } else {
    return "/";
  }
}

const Navbar = () => {

  return (
    <div className="container">

      <div>
        <Link to={logo()}
          className="header-logo header-text"
        >
          BetterFinance
          </Link>
      </div>

      <Link to="/" onClick={logout}
        className="header-text"
      >
        logout
        </Link>
      <Link to="/debt"
        className="header-text"
      >
        Debt
        </Link>
      <Link to="/spendings"
        className="header-text"
      >
        Spendings
        </Link>
      <Link to="/dashboard"
        className="header-text"
      >
        Dashboard
        </Link>

    </div>
  );
}
export default Navbar;