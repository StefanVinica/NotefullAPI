const express = require('express')
const { isWebUri } = require('valid-url')
const logger = require('../src/logger')
const FolderServices = require('./folders-services')
const xss = require('xss')

const foldersRouter = express.Router()
const bodyParser = express.json()

const serializeFolder = folder => ({
    id: folder.id,
    name: folder.folder_name
})

foldersRouter
.route('/folders')
.get((req,res, next)=>{
    FolderServices.getAllFolders(req.app.get('db'))
    .then(folders =>{
        res.json(folders.map(serializeFolder))
    })
    .catch(next)
})

module.exports = foldersRouter