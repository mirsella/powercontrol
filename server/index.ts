import express from 'express'
import bearerToken from 'express-bearer-token';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app: express.Application = express();
app.use(express.json())
app.use(cors({origin: '*'}))
app.use(helmet())
app.use(bearerToken())
app.use(morgan('common'));

import config from './config';

app.use((req, res, next) => {
  // @ts-ignore: express-bearer-token doesn't add token to Request type
  const bearertoken = req.token
  if (bearertoken !== config.token) {
    console.error('wrong token', bearertoken)
    res.statusMessage = 'token unauthorized'
    res.sendStatus(401)
  } else {
    next()
  }
})

require('./routes')(app);
import './grub'

const port = config.port || 8080
app.listen(port, () => console.log("listening on "+port))
