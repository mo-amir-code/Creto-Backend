require("dotenv/config")
const express = require("express");
const cors = require("cors");
const routers = require("./routers");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(routers);

module.exports = app;
