const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
//ROUTE 1:Get all the notes using :get:"/api/note/getuser"login reqjires
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server  Error occured");

    }

})
//ROUTE 2:add a new note using :post:"/api/note//addnoter" login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 5 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 10 }),

], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //if there are errors ,return bad request and the errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server  Error occured");

    }

})
//ROUTE 2:UPDATAE  a existing note using :put:"/api/note/updatenote" login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server  Error occured");

    }




})
////ROUTE 2:delete  a existing note using :delete:"/api/note/deletenote" login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        const { title, description, tag } = req.body;
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been deleted" })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server  Error occured");

    }



})
module.exports = router