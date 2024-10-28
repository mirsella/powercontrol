const gpio = require("onoff").Gpio;
import config from "./config";
import { startWait } from "./grub";

let powerPin = new gpio(config.pins.power, "high");
let resetPin = new gpio(config.pins.reset, "high");

const deboucetime = 500;
async function reset() {
  resetPin.writeSync(0);
  setTimeout(() => {
    resetPin.writeSync(1);
  }, deboucetime);
  startWait();
}
async function power() {
  powerPin.writeSync(0);
  setTimeout(() => {
    powerPin.writeSync(1);
  }, deboucetime);
  startWait();
}
async function reboot() {
  await power();
  setTimeout(() => {
    power();
  }, config.shutdownTime);
}

export { power, reset, reboot };
