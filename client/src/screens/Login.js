import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        axios.post("/api/login", {
            email: this.state.email,
            password: this.state.password
        })
            .then(response => {
                sessionStorage.setItem("key", response.headers['x-auth-token']);
                this.props.history.push("/home");
            })
            .catch(error => {
                alert(error.response.data);
                console.log(error);
            })

        console.log(userData);
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="register-container login-container">
                <Link to="/" className="back-btn">
                    <i className="material-icons left">keyboard_backspace</i> Back to
                home
                </Link>
                <div className="register-container-text">
                    <h4>
                        <b>Login</b><span className="register-text"> below </span>
                    </h4>
                    <p className="regiseter-text-login">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
                <form className="form" noValidate onSubmit={this.onSubmit}>
                    <div className="section-input">
                        <input
                            className="input"
                            onChange={this.onChange}
                            value={this.state.email}
                            error={errors.email}
                            id="email"
                            type="email"
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="section-input">
                        <input
                            className="input"
                            onChange={this.onChange}
                            value={this.state.password}
                            error={errors.password}
                            id="password"
                            type="password"
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="input-btn">
                        <button
                            style={{
                                width: "150px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            type="submit"
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
export default Login;