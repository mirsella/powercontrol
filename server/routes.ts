import config from './config';
import * as relay from './relay';
import express from 'express'
const ping = require('ping')

module.exports = (app: express.Application) => {

	app.all('/', (_req, res) => {
		res.send("powercontrol")
	}),

	app.all('/getnextboot', (_req, res) => {
		res.json(config.nextboot)
	}),

	app.all('/setnextboot', (req, res) => {
		if (config.setnextboot(req.body)) {
			res.send(req.body)
		} else {
			res.status(400)
			res.send("invalid config")
		}
	}),

	app.all('/getpins', (_req, res) => {
		res.json(config.pins)
	}),

	app.all('/setpins', (req, res) => {
		if (config.setpins(req.body)) {
			res.send(req.body)
		} else {
			res.status(400)
			res.send("invalid config")
		}
	}),

	app.all('/power', (_req, res) => {
		relay.power()
		res.send("power")
	}),

	app.all('/reset', (_req, res) => {
		relay.reset()
		res.send("reset")
	}),

	app.all('/reboot', (_req, res) => {
		relay.reboot()
		res.send("reboot")
	}),

	app.all('/host_online', (_req, res) => {
		let cfg = { timeout: 1, min_reply: 1 }
		ping.sys.probe(config.host_ip, (isAlive: boolean, error: object) => {
			if (error)
				{
					res.status(400).send(error)
					return
				}
				res.send(isAlive)
		})
	})
}
