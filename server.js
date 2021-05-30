require('dotenv').config();
const { PORT = 8080, MONGODB_URL } = process.env;
const express = require('express');
const app = express();
// const mongoose = require("mongoose")
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('./db/db');
const AuthRouter = require('./controllers/user');
const User = require('./models/user');
const auth = require('./auth');
const NoteRouter = require('./controllers/notes');

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
// app.use(morgan("dev"));

app.get('/', auth, (req, res) => {
    res.json(req.payload);
    res.send('Airborne!');
});

app.use('/auth', AuthRouter);

app.use('/note', NoteRouter);

// const run = require('./run.json');
// const hike = require('./hike.json');
// const scenic = require('./scenic.json');

mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// Used to be db/connection
// mongoose.connection
// .on("open", () => console.log("Green Light GO!"))
// .on("close", () => console.log("Red Light NOGO"))
// .on("error", (error) => console.log(error))

// models
const RunSchema = new mongoose.Schema({
    title: String,
    image: String,
    distance: String,
    location: String,
    difficulty: String,
    name: String,
});

const HikeSchema = new mongoose.Schema({
    title: String,
    image: String,
    distance: String,
    location: String,
    difficulty: String,
    name: String,
});

const ScenicSchema = new mongoose.Schema({
    title: String,
    image: String,
    distance: String,
    location: String,
    name: String,
});

const Run = mongoose.model('Run', RunSchema);

const Hike = mongoose.model('Hike', HikeSchema);

const Scenic = mongoose.model('Scenic', ScenicSchema);

// middleware

//////////////////////////////////////////////////////////////////////////
const associateWithUser = async (body) => {
    let itemToAssociate = null;
    const setAssociation = async (model) => {
        itemToAssociate = await model.findById(body.id);
    };

    if (body.type === 'runs') {
        await setAssociation(Run);
    }
    if (body.type === 'hikes') {
        await setAssociation(Hike);
    }
    if (body.type === 'scenics') {
        await setAssociation(Scenic);
    }

    const user = await User.findOne({ username: body.username }, '-password');
    user.cart[`${body.type}`].push(itemToAssociate);
    user.save();
};

app.get('/run', auth, async (req, res) => {
    const allRuns = await Run.find({});
    const type = `${req._parsedUrl._raw.split('/')[1]}s`;
    const user = await await User.findOne(
        { username: req.payload.username },
        '-password'
    );
    // await findOne.execPopulate(`cart.${type}`); for more than just _ids
    try {
        res.json({
            all_runs: allRuns,
            user_created: user.cart[type],
            username: user.username,
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

app.get('/hike', auth, async (req, res) => {
    const allHikes = await Hike.find({});
    const type = `${req._parsedUrl._raw.split('/')[1]}s`;
    const user = await await User.findOne(
        { username: req.payload.username },
        '-password'
    );
    // await findOne.execPopulate(`cart.${type}`); for more than just _ids
    try {
        res.json({
            all_hikes: allHikes,
            user_created: user.cart[type],
            username: user.username,
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

app.get('/scenic', auth, async (req, res) => {
    const allWalks = await Scenic.find({});
    const type = `${req._parsedUrl._raw.split('/')[1]}s`;
    const user = await await User.findOne(
        { username: req.payload.username },
        '-password'
    );
    // await findOne.execPopulate(`cart.${type}`); for more than just _ids
    try {
        res.json({
            all_walks: allWalks,
            user_created: user.cart[type],
            username: user.username,
        });
    } catch (error) {
        res.status(400).json(error);
    }
});

// create run route
app.post('/run', auth, async (req, res) => {
    try {
        const newRun = await Run.create(req.body);
        await associateWithUser({
            id: newRun._id,
            type: `${req._parsedUrl._raw.split('/')[1]}s`,
            username: req.payload.username,
        });
        res.json(newRun);
    } catch (error) {
        res.status(400).json(error);
    }
});

// create hike route
app.post('/hike', auth, async (req, res) => {
    try {
        const newHike = await Hike.create(req.body);
        await associateWithUser({
            id: newHike._id,
            type: `${req._parsedUrl._raw.split('/')[1]}s`,
            username: req.payload.username,
        });
        res.json(newHike);
    } catch (error) {
        res.status(400).json(error);
    }
});

// create scenic route
app.post('/scenic', auth, async (req, res) => {
    try {
        const newScenic = await Scenic.create(req.body);
        await associateWithUser({
            id: newScenic._id,
            type: `${req._parsedUrl._raw.split('/')[1]}s`,
            username: req.payload.username,
        });
        res.json(newScenic);
    } catch (error) {
        res.status(400).json(error);
    }
});

// run update route
app.put('/run/:id', auth, async (req, res) => {
    try {
        res.json(
            await Run.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        res.status(400).json(error);
    }
});

// hike update route
app.put('/hike/:id', auth, async (req, res) => {
    try {
        res.json(
            await Hike.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        res.status(400).json(error);
    }
});

// scenic update route
app.put('/scenic/:id', auth, async (req, res) => {
    try {
        res.json(
            await Scenic.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
        );
    } catch (error) {
        res.status(400).json(error);
    }
});

// delete
app.delete('/run/:id', auth, async (req, res) => {
    try {
        res.json(await Run.findByIdAndRemove(req.params.id, req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

// delete
app.delete('/hike/:id', auth, async (req, res) => {
    try {
        res.json(await Hike.findByIdAndRemove(req.params.id, req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

// delete
app.delete('/scenic/:id', auth, async (req, res) => {
    try {
        res.json(await Scenic.findByIdAndRemove(req.params.id, req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

app.listen(PORT, () => console.log('ALL THE WAY!'));
