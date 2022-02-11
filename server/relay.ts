const gpio = require('onoff').Gpio;
// const config = require('./config')
import * as config from './config'

let power = new gpio(config.getpins().power, 'high');
let reset = new gpio(config.getpins().reset, 'high');

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

function reloadpins () {
  power.unexport();
  reset.unexport();
  power = new gpio(config.getpins().power, 'high');
  reset = new gpio(config.getpins().reset, 'high');
}

export {
  presspower,
  pressreset,
  reloadpins
}
