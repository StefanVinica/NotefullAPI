require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require('./errorhandler')
const validatebearertoken = require('./validate-bearer-token')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(validatebearertoken)

app.get('/', (req,res)=>{
    res.send('Hello, world!')
})

app.use(errorHandler)

module.exports = app