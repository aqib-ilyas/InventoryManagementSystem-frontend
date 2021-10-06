import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Avatar, Grid, Paper, TextField, Button } from "@material-ui/core/";
import axios from "axios";
import AddCircleOutlined from "@material-ui/icons/AddCircleOutlined";

const paperStyle = {
  padding: 20,
  height: "75vh",
  width: "50vh",
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

class AddProduct extends Component {
  constructor() {
    super();
    this.state = {
      status: "",
      product_name: "",
      unit_price: "",
      product_description: "",
      quantity: "",
      product_image: null,
    };
  }

  handelChange = (field) => (event) => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleSubmit = () => {
    const data = new FormData();
    data.append("product_name", this.state.product_name);
    data.append("product_description", this.state.product_description);
    data.append("unit_price", this.state.unit_price);
    data.append("quantity", this.state.quantity);
    data.append("seller_id", localStorage.getItem("USERNAME"));
    data.append(
      "product_image",
      this.state.product_image,
      this.state.product_image.name
    );

    console.log("clicked");
    axios
      .post("http://127.0.0.1:8000/api/add_products/", data, {
        headers: {
          Authorization: `Token ${localStorage.getItem("TOKEN")}`,
        },
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data["response"] === "success") {
          this.setState({
            status: data["response"],
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
                TOKEN: localStorage.getItem("TOKEN"),
                USERNAME: localStorage.getItem("USERNAME"),
              },
            }}
          />
        )}

        <Grid>
          <Paper elevation={10} style={paperStyle}>
            <Grid align="center">
              <Avatar style={avatarStyle}>{<AddCircleOutlined />}</Avatar>
              <h2>Add Products</h2>
            </Grid>

            <TextField
              name="product_name"
              variant="outlined"
              required
              fullWidth
              id="product_name"
              label="Product title"
              placeholder="Enter product title"
              autoFocus
              style={textFieldStyle}
              onChange={this.handelChange("product_name")}
            />
            <TextField
              name="product_description"
              variant="outlined"
              required
              fullWidth
              id="product_description"
              label="Product description"
              placeholder="Enter description"
              style={textFieldStyle}
              onChange={this.handelChange("product_description")}
            />
            <TextField
              name="product_quantity"
              variant="outlined"
              required
              fullWidth
              id="product_quantity"
              label="Product quantity"
              placeholder="Input product quantity"
              style={textFieldStyle}
              onChange={this.handelChange("quantity")}
            />

            <TextField
              name="unit_price"
              variant="outlined"
              required
              fullWidth
              id="unit_price"
              label="Unit price"
              placeholder="Input unit price of product"
              style={textFieldStyle}
              onChange={this.handelChange("unit_price")}
            />
            <input
              style={{ margin: "20px " }}
              accept="image/*"
              id="image"
              type="file"
              onChange={(event) => {
                var file = event.target.files[0];
                if (!file) return;
                this.setState({
                  product_image: file,
                });
                console.log(this.state.product_image);
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={textFieldStyle}
              onClick={() => this.handleSubmit()}
            >
              Add product
            </Button>
          </Paper>
        </Grid>
      </div>
    );
  }
}

export default AddProduct;
