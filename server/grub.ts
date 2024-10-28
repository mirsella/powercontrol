import config from "./config";
import fs from "fs-extra";

const keycodes: Record<string, number> = {
  ESC: 0x29,
  UP: 0x52,
  DOWN: 0x51,
  ENTER: 0x28,
};

const devicepath = "/dev/hidg0";

let timeout: null | NodeJS.Timeout;
export function startWait() {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(async () => {
    for (const key in config.nextboot) {
      let array = new Array(8).fill(0);
      array[2] = keycodes[key];
      fs.writeFileSync(devicepath, Buffer.from(array));
      fs.writeFileSync("/dev/hidg0", Buffer.alloc(8));
    }
  }, config.menuTime);
}

// const keypresses: Record<string, any> = {
//   ESC: [0x1b],
//   UP: [0x1b, 0x5b, 0x41],
//   DOWN: [0x1b, 0x5b, 0x42],
//   ENTER: "\n",
// };
// import { SerialPort } from "serialport";
// const port = new SerialPort({ path: "/dev/ttyS0", baudRate: 9600 });
// let consecutiveSpaces = 0;
// let lastKey = "";
// const threshold = 15;
// port.on("close", () => console.log("port closed."));
// port.on("error", (error: any) => console.log("Serial port error: " + error));
// port.on("open", () => console.log("port open. Data rate: " + port.baudRate));
// port.on("data", (data: BufferSource) => {
//   if (lastKey === " ") {
//     consecutiveSpaces++;
//   } else {
//     consecutiveSpaces = 0;
//   }
//   if (consecutiveSpaces > threshold) {
//     console.log(new Date(), "Sending keypresses");
//     consecutiveSpaces = 0;
//     config.nextboot.forEach((key: string) => {
//       port.write(keypresses[key]);
//     });
//   }
//   lastKey = data.toString();
// });
