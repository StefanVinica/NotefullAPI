const express = require('express')
const { isWebUri } = require('valid-url')
const logger = require('../src/logger')
const FolderServices = require('./folders-services')
const xss = require('xss')
const FolderService = require('./folders-services')
const path = require('path')

const foldersRouter = express.Router()
const bodyParser = express.json()

const serializeFolder = folder => ({
    id: folder.id,
    name: folder.folder_name
})

foldersRouter
    .route('/folders')
    .get((req, res, next) => {
        FolderServices.getAllFolders(req.app.get('db'))
            .then(folders => {
                res.json(folders.map(serializeFolder))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        if (!req.body['folder_name']) {
            logger.error(`Folder Name is required`)
            return res.status(400).send(`Folder Name is required`)
        }
        const { folder_name } = req.body
        const newFolder = { folder_name }

        FolderService.insertFolder(req.app.get('db'), newFolder)
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${newFolder.id}`))
                    .json(serializeFolder(folder))
            })
            .catch(next)
    })
foldersRouter
    .route('/folders/:folder_Id')
    .get((req, res, next) => {
        const { folder_Id } = req.params
        FolderServices.getById(req.app.get('db'), folder_Id)
            .then(folder => {
                if (!folder) {
                    logger.error(`Folder with id ${folder_Id} not Found`)
                    return res.status(404).json({
                        error: { message: 'Folder not Found' }
                    })
                }
                res.json({
                    id: folder.id,
                    name: xss(folder.folder_name)
                })
                    .catch(next)
            })
    })
    .delete((req, res, next) => {
        const { folder_Id } = req.params
        FolderServices.getById(req.app.get('db'), folder_Id)
            .then(folder => {
                if (!folder) {
                    logger.error(`Folder with id ${folder_Id} not Found`)
                    return res.status(404).json({
                        error: { message: 'Folder not Found' }
                    })
                }
            })
        FolderServices.deleteFolder(req.app.get('db'), folder_Id)
            .then(() => {
                logger.info(`Folder with id ${folder_Id} was deleted`)
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { folder_Id } = req.params
        FolderServices.getById(req.app.get('db'), folder_Id)
            .then(folder => {
                if (!folder) {
                    logger.error(`Folder with id ${folder_Id} not Found`)
                    return res.status(404).json({
                        error: { message: 'Folder not Found' }
                    })
                }
            })
        if (!req.body['folder_name']) {
            logger.error(`Folder Name is required`)
            return res.status(400).send(`Folder Name is required`)
        }
        const { folder_name } = req.body
        const newFolder = { folder_name }
        FolderServices.updateFolder(req.app.get('db'),folder_Id,newFolder)
        .then(res.status(204).end())
        .catch(next)
    })


module.exports = foldersRouter