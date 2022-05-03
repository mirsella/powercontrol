import fs from "fs-extra"
import { reloadpins } from "./relay"

type Pins = { reset: Number, power: Number}
type Config = {
  bootTime: Number,
  shutdownTime: Number,
  token: String,
  boot_keypresses: Object,
  pins: Pins
}
const possibleKey = ["DOWN", "UP", "ENTER", "ESC"]

const config = fs.readJsonSync('./config.json')
async function writeconfig() { fs.writeJsonSync('./config.json', config); }

if (process.argv.includes('token')) {
  console.log('generating new token')
  gentoken()
}
if (config.token.length === 0) {
  console.log('no token found in config.json, generating new token')
  gentoken()
}

if (
  typeof config.token === "string" && config.token.length > 0 &&
  checkkeypresses(config.boot_keypresses) &&
  checkpins(config.pins) &&
  typeof config.bootTime === "number" && config.bootTime >= 1 &&
  typeof config.shutdownTime === "number" && config.shutdownTime >= 1
  ) {
    console.log('config ok')
} else {
  console.log('config error')
  process.exit(1)
}

function checkkeypresses (keypresses: string[]) {
  return (
    typeof keypresses === "object" && Object.keys(keypresses).length > 0 &&
      Object(keypresses).every(( key: any ) => {
      return (typeof key === "string" && possibleKey.includes(key))
    })
  )
}
function checkpins (pins: Pins) {
  return (
    typeof pins === "object" && Object.keys(pins).length > 0 &&
      typeof pins.reset === "number" && pins.reset > 0 &&
      typeof pins.power === "number" && pins.power > 0
  )
}

function gettoken() {
  return config.token
}
function gentoken() {
  const token = require('crypto').randomBytes(64).toString('hex')
  config.token = token
  writeconfig()
  console.log("token =", token)
}

function getnextboot() {
  return config.boot_keypresses
}
function setnextboot(keypresses: string[]) {
  const valid = checkkeypresses(keypresses)
  if (valid) {
    config.boot_keypresses = keypresses
    writeconfig()
  }
  return valid
}

function getpins() {
  return config.pins
}
function setpins(pins: Pins) {
  const valid = checkpins(pins)
  if (valid) {
    config.pins = pins
    writeconfig()
    // reloadpins
  }
  return valid
}
function getBootTime() {
  return config.bootTime
}
function getShutdownTime() {
  return config.shutdownTime
}

export {
  gettoken,
  getnextboot,
  setnextboot,
  getpins,
  setpins,
  getBootTime,
  getShutdownTime
}
