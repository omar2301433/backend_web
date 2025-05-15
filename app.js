const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv").config();

// middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));


// routes
const productRouter = require("./routes/product");


const api = process.env.API_URL;

app.use(`${api}/product`, productRouter);


// database connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "shop-user",
  }).then(() => {
    console.log("Database connection is ready");
  }).catch((err) => {
    console.log(err);
  });

  // server
app.listen(3000, () => {
  console.log(`${api}/products`);
  console.log(api);
  console.log("Server is running on port 3000");
});
