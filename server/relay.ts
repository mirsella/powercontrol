const gpio = require('onoff').Gpio;
const config = require('./config')

let power = new gpio(config.pins.power, 'high');
let reset = new gpio(config.pins.reset, 'high');

const deboucetime = 500;
async function pressreset () {
  reset.writeSync(0);
  setTimeout(() => {
    reset.writeSync(1);
  }, deboucetime);
}
async function presspower () {
  power.writeSync(0);
  setTimeout(() => {
    power.writeSync(1);
  }, deboucetime);
}
async function reboot() {
  await presspower()
  setTimeout(() => {
    presspower()
  }, config.ShutdownTime)
}

function reloadpins () {
  power.unexport();
  reset.unexport();
  power = new gpio(config.pins.power, 'high');
  reset = new gpio(config.pins.reset, 'high');
}

export {
  presspower,
  pressreset,
  reboot,
  reloadpins
}
