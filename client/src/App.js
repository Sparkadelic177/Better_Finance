import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./components/Navbar";
import Landing from "./screens/Landing";
import Register from "./screens/Register";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Dashboard from "./screens/Dashboard";
import Debt from "./screens/Debt"
import Spendings from "./screens/Spendings"
import './styles/App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/debt" component={Debt} />
            <Route exact path="/spendings" component={Spendings} />
            <Route component={Dashboard} /> 
          </Switch>
        </div>
      </Router>

    );
  }
}

export default App;
