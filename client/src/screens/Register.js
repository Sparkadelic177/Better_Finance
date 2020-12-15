import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../styles/Register.css'

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      loaded: false,
    };
  }

  //while the input is being change it changes the state
  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  //on submit send the data to the server, if good redirect the page to home
  onSubmit = e => {
    e.preventDefault();
  
    axios.post("api/signup",{
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      retypedPassword: this.state.password2
    })
    .then((response) => {
      sessionStorage.setItem("key", response.headers['x-auth-token']);
      this.props.history.push("/home");
    })
    .catch((error) => alert(error.response.data));
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="register-container">
        <Link to="/" className="back-btn">
          <i className="material-icons left">keyboard_backspace</i> Back to
          home
        </Link>
        <div>
          <h4 className="register-container-text">
            <b>Register</b> <span className="register-text">below</span>
          </h4>
          <p className="regiseter-text-login">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
        <form className="form" noValidate onSubmit={this.onSubmit}>
          <div className="section-input">
            <input
              className="input"
              onChange={this.onChange}
              value={this.state.name}
              error={errors.name}
              id="name"
              type="text"
            />
            <label htmlFor="name">Name</label>
          </div>
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
          <div className="section-input">
            <input
              className="input"
              onChange={this.onChange}
              value={this.state.password2}
              error={errors.password2}
              id="password2"
              type="password"
            />
            <label htmlFor="password2">Confirm Password</label>
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
              className=""
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    );
  }
}
export default Register;