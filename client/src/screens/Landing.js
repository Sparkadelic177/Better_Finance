import React from "react";
import { Link } from "react-router-dom";
import '../styles/Landing.css'

function Landing() {
    return (
        <div className="landingContainer">
            <h2>
                <b>Track</b> <span className="inner-container-text">Your Finances Better Than Before</span>
            </h2>
            <h3 className="inner-container-description">
                Search all your transactions, Track Your Networth, Make your way to debt free zone, and more...
            </h3>
            <br />
            <section className = "both-btn" >
                <div className="register-btn">
                    <Link
                        to="/register"
                        style={{
                        width: "140px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px"
                        }}
                        className="register-text"
                    >
                        Register
                    </Link>
                </div>
                <div className="login-btn">
                    <Link
                        to="/login"
                        style={{
                        width: "140px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px"
                        }}
                        className="login-text"
                    >
                        Log In
                    </Link>
                </div>
            </section>
        </div>
    );
}
export default Landing;