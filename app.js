const express = require("express");
const morgan = require("morgan");

app = express();

const orderRouter = require("./routes/orderRoutes");

// MIDDLEWARES
process.env.NODE_ENV === "development" && app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
  console.log("hello from the middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES DEFINITION
app.use("/api/v1/orders", orderRouter);
module.exports = app;
