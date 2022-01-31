const express = require('express')
import { Application, Request, Response } from 'express'
const bearerToken = require('express-bearer-token');
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

const app: Application = express();
app.use(express.json())
app.use(cors({origin: '*'}))
app.use(helmet())
app.use(bearerToken())
app.use(morgan('common'));

import { gettoken } from './config'

app.use((req, res, next) => {
  // @ts-ignore: express-bearer-token doesn't add token to Request type
  const bearertoken = req.token
  if (bearertoken !== gettoken()) {
    console.error('wrong token', bearertoken)
    res.statusMessage = 'token unauthorized'
    res.sendStatus(401)
  } else {
    next()
  }
})

require('./routes')(app);
import './grub'

const port = process.env.port || 8080
app.listen(port, () => console.log("listening on "+port))
