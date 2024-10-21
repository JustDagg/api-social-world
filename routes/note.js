const express = require('express');
const router = express.Router();
const { getNotes, getNoteByUserId, createNote, updateNote, deleteNote, noteById } = require('../controllers/note');
const { requireSignin } = require('../controllers/auth'); 

// /notes
router.get('/notes', requireSignin, getNotes);

// /notes/user/:userId
router.get('/notes/user/:userId', requireSignin, getNoteByUserId);

// /note/new/:userId
router.post('/note/new/:userId', requireSignin, createNote);

// /note/:noteId
router.put('/note/:noteId', requireSignin, updateNote);

// /note/:noteId
router.delete('/note/:noteId/:userId', requireSignin, deleteNote);

// :noteId
router.param('noteId', noteById);

module.exports = router;
