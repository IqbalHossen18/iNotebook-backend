const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { check, validationResult } = require("express-validator");

const fetchuser = require("../middleware/fetchuser");

//ROUTE 1: get all notes using post : '/api/notes/fetchallnotes' login reqiured

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

//ROUTE 2: adding notes using post : '/api/notes/addnotes' login required

router.post(
  "/addnotes",
  fetchuser,
  [
    check("title", " enter a valid name ").isLength({ min: 3 }),
    check("description", "description should be atleast 5 charecter").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savenote = await note.save();
      res.json(note);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE 3: update notes using : '/updatenote/:id' login required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
  //making a object where we will make changes...
  try {
    const newnote = {}
    const { title, description, tag } = req.body;
    if (title) { newnote.title = title }
    if (description) { newnote.description = description }
    if (tag) { newnote.tag = tag }
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send('Not Found') }
    if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }
    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
    res.json(note)
  } catch (error) {
    console.error(error);
    res.status(500).send("internal server error");
  }
})

//ROUTE 4: delete note using delete '/deletenotes/:id login required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id)
    if (!note) { return res.status(404).send('Not Found') }
    if (note.user.toString() !== req.user.id) { return res.status(401).send('Not Allowed') }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"success":"note have been deleted", note:note})
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
