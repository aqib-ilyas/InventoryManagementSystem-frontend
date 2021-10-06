import React, { Component } from "react";

import { Link, Redirect } from "react-router-dom";
import { Avatar, Grid, Paper, TextField, Button } from "@material-ui/core/";
import axios from "axios";
import { LockOpenOutlined } from "@material-ui/icons";

const paperStyle = {
  padding: 20,
  height: "70vh",
  width: "40vh",
  margin: "20px auto",
  alignItems: "center",
  alignSelf: "center",
};

const avatarStyle = {
  background: "red",
};

const textFieldStyle = {
  marginTop: 10,
};

class SignUp extends Component {
  state = {
    username: "",
    password1: "",
    password2: "",
    fname: "",
    lname: "",
    token: "",
    status: "",
  };

  handelChange = (field) => (event) => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    if (this.state.password1 !== this.state.password2) {
      console.log("Passwords don't match");
    } else {
      axios
        .post("http://127.0.0.1:8000/api/register_user/", {
          username: this.state.username,
          password: this.state.password1,
          first_name: this.state.fname,
          last_name: this.state.lname,
        })
        .then((res) => {
          const data = res.data;
          console.log(data["token"]);
          if (data["status"] === "success") {
            localStorage.setItem("TOKEN", data["token"]);
            localStorage.setItem("USERNAME", this.state.username);
            this.setState({
              token: data["token"],
              status: data["status"],
            });
          }
        });
    }
  };

  render() {
    return (
      <div>
        {this.state.status === "success" && (
          <Redirect
            to={{
              pathname: "/home",
              state: {
                STATUS: "home",
                TOKEN: this.state.token,
                USERNAME: this.state.username,
              },
            }}
          />
        )}
        <Grid>
          <Paper elevation={10} style={paperStyle}>
            <Grid align="center">
              <Avatar style={avatarStyle}>
                <LockOpenOutlined />
              </Avatar>
              <h2>Sign Up</h2>
            </Grid>

            <TextField
              name="username"
              variant="outlined"
              required
              fullWidth
              id="username"
              label="Username"
              placeholder="Enter username"
              autoFocus
              style={textFieldStyle}
              onChange={this.handelChange("username")}
            />
            <TextField
              name="first_name"
              variant="outlined"
              required
              fullWidth
              id="first_name"
              label="First name"
              placeholder="Enter first name"
              style={textFieldStyle}
              type="text"
              onChange={this.handelChange("fname")}
            />
            <TextField
              name="last_name"
              variant="outlined"
              required
              fullWidth
              id="last_name"
              label="Last name"
              placeholder="Enter Last name"
              style={textFieldStyle}
              type="text"
              onChange={this.handelChange("lname")}
            />
            <TextField
              name="password1"
              variant="outlined"
              required
              fullWidth
              id="password1"
              label="Password"
              placeholder="Enter password"
              style={textFieldStyle}
              type="password"
              onChange={this.handelChange("password1")}
            />
            <TextField
              name="password2"
              variant="outlined"
              required
              fullWidth
              id="password2"
              label="Password"
              placeholder="Enter password"
              style={textFieldStyle}
              type="password"
              onChange={this.handelChange("password2")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={textFieldStyle}
              onClick={this.handleSubmit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end" style={textFieldStyle}>
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default SignUp;
