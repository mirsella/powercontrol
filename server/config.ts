import fs from "fs-extra"

type Pins = { reset: Number, power: Number}
type Config = {
  bootTime: Number,
  shutdownTime: Number,
  token: String,
  boot_keypresses: Object,
  pins: Pins
}
const possibleKey = ["DOWN", "UP", "ENTER", "ESC"]

const configfile = fs.readJsonSync('./config.json')
async function writeconfig() { fs.writeJsonSync('./config.json', configfile); }

if (process.argv.includes('token')) {
  console.log('generating new token')
  gentoken()
}

if (configfile.token.length === 0) {
  console.log('no token found in config.json, generating new token')
  gentoken()
}

function gentoken() {
  const token = require('crypto').randomBytes(64).toString('hex')
  configfile.token = token
  writeconfig()
  console.log("token =", token)
}

if (
  typeof configfile.token === "string" && configfile.token.length > 0 &&
  checkkeypresses(configfile.boot_keypresses) &&
  checkpins(configfile.pins) &&
  typeof configfile.bootTime === "number" && configfile.bootTime >= 1 &&
  typeof configfile.shutdownTime === "number" && configfile.shutdownTime >= 1
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

configfile.setnextboot = function (keypresses: string[]) {
  const valid = checkkeypresses(keypresses)
  if (valid) {
    config.boot_keypresses = keypresses
    writeconfig()
  }
  return valid
}

configfile.setpins = function (pins: Pins) {
  const valid = checkpins(pins)
  if (valid) {
    config.pins = pins
    writeconfig()
    // reloadpins
  }
  return valid
}

const config = new Proxy(configfile, {
  get(obj, prop) { return obj[prop] },
  set(obj, prop, value) {
    obj[prop] = value
    return true
  }
})

export = config
