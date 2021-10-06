import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Avatar, Grid, Paper, TextField, Button } from "@material-ui/core/";
import axios from "axios";
import { LockOpenOutlined } from "@material-ui/icons";

const paperStyle = {
  padding: 20,
  height: "60vh",
  width: "40vh",
  margin: "50px auto",
  alignItems: "center",
  alignSelf: "center",
};

const avatarStyle = {
  background: "red",
};

const textFieldStyle = {
  marginTop: 10,
};

class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      token: "",
      status: "",
    };
  }

  handelChange = (field) => (event) => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    axios
      .post("http://127.0.0.1:8000/api/login_user/", {
        username: this.state.username,
        password: this.state.password,
      })
      .then((res) => {
        const data = res.data;
        // console.log(data["status"]);
        if (data["status"] === "success") {
          localStorage.setItem("TOKEN", data["token"]);
          localStorage.setItem("USERNAME", this.state.username);
          this.setState({
            token: data["token"],
            status: data["status"],
          });
        }
      });
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
              <h2>Sign In</h2>
            </Grid>

            <TextField
              autoComplete="username"
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
              autoComplete="password"
              name="password"
              variant="outlined"
              required
              fullWidth
              id="password"
              label="Password"
              placeholder="Enter password"
              style={textFieldStyle}
              type="password"
              onChange={this.handelChange("password")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={textFieldStyle}
              onClick={this.handleSubmit}
            >
              SIGN IN
            </Button>

            <Grid container justifyContent="flex-end" style={textFieldStyle}>
              <Grid item>
                <Link to="/register" variant="body2">
                  Don't have an account? Register
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default SignIn;
