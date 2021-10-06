import "./App.css";
import SignIn from "./SignIn";
import Home from "./Home";
import SignUp from "./SignUp";
import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      status: "",
    };
  }

  componentDidMount() {
    axios.get("http://127.0.0.1:8000/api/login_user/").then((res) => {
      const data = res.data;
      console.log(data["status"]);
      this.setState({
        token: data["token"],
        status: data["status"],
      });
    });
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/register" component={SignUp} />
            <Route path="/login" component={SignIn} />
            <Route path="/add-products" component={AddProduct} />
            <Route path="/edit-product" component={EditProduct} />
          </Switch>

          {this.state.status === "success" && (
            <Redirect
              to={{
                pathname: "/home",
                state: {
                  STATUS: this.state.status,
                  TOKEN: this.state.token,
                },
              }}
            />
          )}
          {this.state.status === "failure" && <Redirect to="/login" />}
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
