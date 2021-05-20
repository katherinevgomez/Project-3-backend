require("dotenv").config();
const mongoose = require("mongoose");

const {MONGODB_URL} = process.env;

//connect
mongoose.connect(MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})

//message
mongoose.connection
.on("open", () => console.log("connected to mongo"))
.on("close", () => console.log("disconnected from mongo"))
.on("error", (error) => console.log(error))

module.exports = mongoose