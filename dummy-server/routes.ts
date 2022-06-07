import config from './config'
import { Application } from 'express'

module.exports = (app: Application) => {

  app.all('/', (req, res) => {
    res.send("powercontrol")
  })

  app.all('/getnextboot', (req, res) => {
    res.json(config.nextboot)
  })

  app.all('/setnextboot', (req, res) => {
    if (config.setnextboot(req.body)) {
      res.send(req.body)
    } else {
      res.status(400)
      res.send("invalid config")
    }
  })

  app.all('/getpins', (req, res) => {
    res.json(config.pins)
  })

  app.all('/setpins', (req, res) => {
    if (config.setpins(req.body)) {
      res.send(req.body)
    } else {
      res.status(400)
      res.send("invalid config")
    }
  })

  app.all('/power', (req, res) => {
    console.log("power")
    res.send("power")
  })

  app.all('/reset', (req, res) => {
    console.log("reset")
    res.send("reset")
  }),

  app.all('/reboot', (req, res) => {
    console.log("reboot")
    res.send("reboot")
  })
}
