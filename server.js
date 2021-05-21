require("dotenv").config()
const { PORT = 3000, MONGODB_URL } = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

const run = require("./run.json");
const hike = require("./hike.json");
const scenic = require("./scenic.json");

mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

mongoose.connection
.on("open", () => console.log("Green Light GO!"))
.on("close", () => console.log("Red Light NOGO"))
.on("error", (error) => console.log(error))

// models
const RunSchema = new mongoose.Schema({
    title: String,
    image: String,
    distance: String,
    location: String,
    difficulty: String,
    name: String
})

const HikeSchema = new mongoose.Schema({
    title: String,
    image: String,
    distance: String,
    location: String,
    difficulty: String,
    name: String
})

const ScenicSchema = new mongoose.Schema({
    title: String,
    image: String,
    distance: String,
    location: String,
    name: String
})

const Run = mongoose.model("Run", RunSchema)

const Hike = mongoose.model("Hike", HikeSchema)

const Scenic = mongoose.model("Scenic", ScenicSchema)

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Airborne!")
});

//////////////////////////////////////////////////////////////////////////

app.get("/run", async (req, res) => {
    try{
        res.json(await Run.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

app.get("/hike", async (req, res) => {
    try{
        res.json(await Hike.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

app.get("/scenic", async (req, res) => {
    try{
        res.json(await Scenic.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

// create run route
app.post("/run", async (req, res) => {
    try{
        res.json(await Run.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});

// create hike route
app.post("/hike", async (req, res) => {
    try{
        res.json(await Hike.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});

// create scenic route
app.post("/scenic", async (req, res) => {
    try{
        res.json(await Scenic.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});


// run update route
app.put("/run/:id", async (req, res) => {
    try {
        res.json(await Run.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
});

// hike update route
app.put("/hike/:id", async (req, res) => {
    try {
        res.json(await Hike.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
});

// scenic update route
app.put("/scenic/:id", async (req, res) => {
    try {
        res.json(await Scenic.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
});


// delete
app.delete("/run/:id", async (req, res) => {
    try {
        res.json(await Run.findByIdAndRemove(req.params.id, req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});

// delete
app.delete("/hike/:id", async (req, res) => {
    try {
        res.json(await Hike.findByIdAndRemove(req.params.id, req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});

// delete
app.delete("/scenic/:id", async (req, res) => {
    try {
        res.json(await Scenic.findByIdAndRemove(req.params.id, req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});


app.listen(PORT, () => console.log("ALL THE WAY!"))