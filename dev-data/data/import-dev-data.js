const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Order = require("../../models/orderModel");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connection to db successful!");
  });

const orders = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

//IMPORTING DEV DATA
const importData = async () => {
  try {
    await Order.create(orders);
    console.log("Data successfully loaded");
  } catch (error) {
    console.log(error);
  }
};

//DELETING DEV DATA
const deleteData = async () => {
  try {
    await Order.deleteMany();
    console.log("Data successfully deleted");
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
