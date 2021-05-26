const User = require("../models/user");
const Note = require("../models/notes");
const auth = require("../auth")
const { Router } = require("express");
const { receiveMessageOnPort } = require("worker_threads");
const router = Router();

// index
router.get("/", auth, async, (req, res) => {
    try {
        const {username} = req.payload
        res.status(200).json(await Note.find({username}))
    }
    catch(error){
        res.status(400).json({error})
    }
})
// create
router.post("/", auth, async, (req, res) => {
    try{
        const {username} = req.payload
        req.body.username = username
        res.status(200).json(await Note.create({username}))
    }
    catch(error){
        res.status(400).json({error})
    }
})
// update
router.put("/:id", auth, async, (req, res) => {
    try{
        const {username} = req.payload
        req.body.username = username
        const {id} = req.params
        res.status(200).json(await Note.findByIdAndUpdate(id, req.body, {new: true}))
    }
    catch(error){
        res.status(400).json({error})
    }
})
// delete
router.get("/:id", auth, async, (req, res) => {
    try{
        const {id} = req.params
        res.status(200).json(await Note.findByIdAndUpdate(id))
    }
    catch(error){
        res.status(400).json({error});
    }
})

module.exports = router;