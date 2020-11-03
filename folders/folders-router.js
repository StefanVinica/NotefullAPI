const express = require('express')
const { isWebUri } = require('valid-url')
const logger = require('../src/logger')
const FolderServices = require('./folders-services')
const xss = require('xss')
const FolderService = require('./folders-services')

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
.post(bodyParser,(req,res,next)=>{
    if(!req.body['folder_name']){
        logger.error(`Folder Name is required`)
        return res.status(400).send(`Folder Name is required`)
    }
    const {folder_name} = req.body
    const newFolder = {folder_name}

    FolderService.insertFolder(req.app.get('db'),newFolder)
    .then(folder=>{
        res
        .status(201)
        .location(`http://localhost:8080/api/folders/${newFolder.id}`)
        .json(serializeFolder(folder))
    })
    .catch(next)
})

module.exports = foldersRouter