const gpio = require('onoff').Gpio;
const config = require('./config')

let powerPin = new gpio(config.pins.power, 'high');
let resetPin = new gpio(config.pins.reset, 'high');

const deboucetime = 500;
async function reset () {
  resetPin.writeSync(0);
  setTimeout(() => {
    resetPin.writeSync(1);
  }, deboucetime);
}
async function power () {
  powerPin.writeSync(0);
  setTimeout(() => {
    powerPin.writeSync(1);
  }, deboucetime);
}
async function reboot() {
  await power()
  setTimeout(() => {
    power()
  }, config.shutdownTime)
}

function reloadpins () {
  powerPin.unexport();
  resetPin.unexport();
  powerPin = new gpio(config.pins.power, 'high');
  resetPin = new gpio(config.pins.reset, 'high');
}

export {
  power,
  reset,
  reboot
}
