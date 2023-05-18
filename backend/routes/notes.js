const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Routes-1 Get all the notes using : GET "/api/notes/fetchallnotes"  Login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {

        const notes = await Note.find({ user: req.user.id })
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }

})

// Routes-2 Add a new notes using : POST "/api/notes/addnote"  Login required

router.post('/addnote', fetchuser, [

    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be 5 characters').isLength({ min: 5 }),

], async (req, res) => {

    try {

        const { title, description, tag } = req.body;
        //if there are error , return Bad request and the error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Note({ title, description, tag, user: req.user.id })

        const saveNote = await notes.save()

        res.json(saveNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
})

// Routes-3 Update an Existing Notes  using : PUT "/api/notes/updatenote"  Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        //Create a newNote object

        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and update it

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }

})

// Routes-4 Delete an Existing Notes  using : DELETE "/api/notes/deletenote"  Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        //Find the note to delete it

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        //Aloow delettion only if user owns this notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }


})

module.exports = router