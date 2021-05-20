require("dotenv").config();
const express = require("express");
const mongoose = require("./db/connection");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const {PORT=7777} = process.env;

app.get("/", (req,res) => res.send("hello world!"))
app.listen(PORT, () => console.log(`port running on ${PORT}`))