const config = require('./config')

import { SerialPort } from 'serialport'
const port = new SerialPort({ path: "/dev/ttyS0", baudRate: 9600 })

const keypresses: Record<string, any> = {
  "ESC": [0x1b],
  "UP": [0x1b, 0x5b, 0x41],
  "DOWN": [0x1b, 0x5b, 0x42],
  "ENTER": "\n"
}

let lastDataDate = new Date()
let watching = true
port.on('close', () => console.log('port closed.'));
port.on('error', (error: any) => console.log('Serial port error: ' + error));
port.on('open', () => console.log('port open. Data rate: ' + port.baudRate));
port.on('data', (data: any) => {
  lastDataDate = new Date()
  watching = true
})

setInterval(() => {
  if (watching) {
    if (new Date().getTime() - lastDataDate.getTime() > config.BootTime) {
      console.log('timeout reached')
      watching = false;
      config.nextboot.forEach((key: string) => {
        port.write(keypresses[key])
      })
    }
  }
}, 100)
