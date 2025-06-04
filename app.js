const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(cors());




// middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
 //test

// routes
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const reviewRouter = require("./routes/review");
const shippingRouter = require("./routes/shipping");
const userRouter = require("./routes/user");
const brandRouter = require("./routes/brand");
const categoryRouter = require("./routes/category");
const paymentRouter = require("./routes/payment");


const api = process.env.API_URL;

app.use(`${api}/product`, productRouter);
app.use(`${api}/order`, orderRouter);
app.use(`${api}/review`, reviewRouter);
app.use(`${api}/shipping`, shippingRouter);
app.use(`${api}/user`, userRouter);
app.use(`${api}/brand`, brandRouter);
app.use(`${api}/category`, categoryRouter);
app.use(`${api}/payment`, paymentRouter);


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
  console.log(api);
  console.log("Server is running on port 3000");
});
