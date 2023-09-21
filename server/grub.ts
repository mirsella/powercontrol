import config from "./config";

import { SerialPort } from "serialport";
const port = new SerialPort({ path: "/dev/ttyS0", baudRate: 9600 });

const keypresses: Record<string, any> = {
  ESC: [0x1b],
  UP: [0x1b, 0x5b, 0x41],
  DOWN: [0x1b, 0x5b, 0x42],
  ENTER: "\n",
};

let consecutiveSpaces = 0;
let lastKey = "";
const threshold = 15;
port.on("close", () => console.log("port closed."));
port.on("error", (error: any) => console.log("Serial port error: " + error));
port.on("open", () => console.log("port open. Data rate: " + port.baudRate));
port.on("data", (data: BufferSource) => {
  if (lastKey === " ") {
    consecutiveSpaces++;
  } else {
    consecutiveSpaces = 0;
  }
  if (consecutiveSpaces > threshold) {
    console.log(new Date(), "Sending keypresses");
    consecutiveSpaces = 0;
    config.nextboot.forEach((key: string) => {
      port.write(keypresses[key]);
    });
  }
});
