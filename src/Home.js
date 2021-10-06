import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import useStyles from "./styles";
import { AppBar } from "@material-ui/core";

function Home(props) {
  const [state, setState] = useState({
    token: props.location.state.TOKEN,
    status: props.location.state.STATUS,
    username: props.location.state.USERNAME,
    products: [],
    prod: "",
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  config.headers["Authorization"] = `Token ${localStorage.getItem("TOKEN")}`;

  const classes = useStyles();

  async function getProducts() {
    const res = await fetch("http://127.0.0.1:8000/api/get_products/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("TOKEN")}`,
      },
    });

    res
      .json()
      .then((res) => {
        if (res.length > 0) {
          setState({
            products: res,
            status: "home",
          });
        } else {
          setState({
            products: [],
            status: "home",
          });
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getProducts();
  }, []);

  if (state.status === "home") {
    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <Typography variant="h6">Home</Typography>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <Button
                  variant="outlined"
                  color="default"
                  onClick={() => {
                    //Logout
                    fetch("http://127.0.0.1:8000/api/logout_user/", {
                      method: "GET",
                      headers: {
                        "Content-type": "application/json",
                        Authorization: `Token ${localStorage.getItem("TOKEN")}`,
                      },
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data.response === "success") {
                          localStorage.removeItem("TOKEN");
                          setState({
                            status: "failure",
                          });
                        }
                      })
                      .catch((err) => console.log(err));
                  }}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classes.container}>
            <Container maxWidth="sm">
              <Typography
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Inventory Management System
              </Typography>

              <div className={classes.heroButtons}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setState({
                          status: "add",
                        });
                      }}
                    >
                      Add more products
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>
          <Container
            className={classes.cardGrid}
            maxWidth="md"
            justifyContent="center"
          >
            <Grid container spacing={4}>
              {state.products.map((product) => (
                <Grid item key={product["id"]} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={`http://127.0.0.1:8000${product["product_image"]}`}
                      title={product["product_name"]}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h6">
                        {product["product_name"]}
                      </Typography>
                      <Typography gutterBottom>
                        {product["product_description"]}
                      </Typography>
                      <Typography>
                        Unit Price: {product["unit_price"]}$
                      </Typography>
                      <Typography>Quantity: {product["quantity"]}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          setState({
                            status: "edit",
                            prod: product,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => {
                          const request = JSON.stringify({
                            id: product["id"],
                          });
                          fetch("http://127.0.0.1:8000/api/delete_products/", {
                            method: "DELETE",
                            body: request,
                            headers: {
                              "Content-type": "application/json",
                              Authorization: `Token ${localStorage.getItem(
                                "TOKEN"
                              )}`,
                            },
                          })
                            .then((response) => response.json())
                            .then((data) => {
                              if (data["response"] === "success") {
                                getProducts();
                              }
                            })
                            .catch((err) => console.log(err));
                        }}
                      >
                        Remove
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
      </React.Fragment>
    );
  } else if (state.status === "add") {
    return <Redirect to="/add-products" />;
  } else if (state.status === "edit") {
    return (
      <Redirect
        to={{
          pathname: "/edit-product",
          state: {
            id: state.prod["id"],
            name: state.prod["product_name"],
            desc: state.prod["product_description"],
            price: state.prod["unit_price"],
            quantity: state.prod["quantity"],
            image: state.prod["product_image"],
          },
        }}
      />
    );
  } else {
    return <Redirect to="/login" />;
  }
}

export default Home;
