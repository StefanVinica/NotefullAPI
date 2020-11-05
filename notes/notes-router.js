const express = require('express')
const { isWebUri } = require('valid-url')
const logger = require('../src/logger')
const xss = require('xss')
const NotesServices = require('./notes-services')

const notesRouter = express.Router()
const bodyParser = express.json()

const serializeNote = note => ({
    id: note.id,
    name: xss(note.note_name),
    content: xss(note.note_content),
    modefied: note.note_modefied,
    folder: note.folder
})

notesRouter
    .route('/notes')
    .get((req, res, next) => {
        NotesServices.getAllNotes(req.app.get('db'))
            .then(notes => {
                res.json(notes.map(serializeNote))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const {note_name,note_content,folder} = req.body
        const newNote = {note_name,note_content,folder}

        for (const field of ['note_name', 'note_content', 'folder']) {
            if (!req.body[field]) {
              logger.error(`${field} is required`)
              return res.status(400).send(`'${field}' is required`)
            }
          } 
        NotesServices.insertNotes(req.app.get('db'), newNote)
            .then(note => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${newNote.id}`))
                    .json(serializeNote(note))
            })
            .catch(next)
    })
notesRouter
    .route('/notes/:note_Id')
    .get((req, res, next) => {
        const { note_Id } = req.params
        NotesServices.getById(req.app.get('db'), note_Id)
            .then(note => {
                if (!note) {
                    logger.error(`Note with id ${note_Id} not Found`)
                    return res.status(404).json({
                        error: { message: 'Note not Found' }
                    })
                }
                res.json(serializeNote(note))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const { note_Id } = req.params
        NotesServices.getById(req.app.get('db'), note_Id)
            .then(note => {
                if (!note) {
                    logger.error(`note with id ${note_Id} not Found`)
                    return res.status(404).json({
                        error: { message: 'Note not Found' }
                    })
                }
            })
        NotesServices.deleteNote(req.app.get('db'), note_Id)
            .then(() => {
                logger.info(`Note with id ${note_Id} was deleted`)
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { note_Id } = req.params
        NotesServices.getById(req.app.get('db'), note_Id)
            .then(note => {
                if (!note) {
                    logger.error(`Note with id ${note_Id} not Found`)
                    return res.status(404).json({
                        error: { message: 'Note not Found' }
                    })
                }
            })
            for (const field of ['note_name', 'note_content', 'folder']) {
                if (!req.body[field]) {
                  logger.error(`${field} is required`)
                  return res.status(400).send(`'${field}' is required`)
                }
              } 
              const {note_name,note_content,folder} = req.body
              const newNote = {note_name,note_content,folder}
        NotesServices.updateNote(req.app.get('db'),note_Id,newNote)
        .then(res.status(204).end())
        .catch(next)
    })


module.exports = notesRouter