const config = require('./config')
import * as fs from 'fs-extra';

let SerialPort = require('serialport');
let port = new SerialPort('/dev/ttyS0', { baudRate: 9600 });

const keypresses: Record<string, any> = {
  "ESC": [0x1b],
  "UP": [0x1b, 0x5b, 0x41],
  "DOWN": [0x1b, 0x5b, 0x42],
  "ENTER": "\n"
}

const pattern = fs.readJsonSync('./bootpattern.json')
let currentpattern: Date[] = []

let lastDataDate = new Date()
let lastWatchDate = new Date(0,0,0,0,0,0,0)
let watching = true
port.on('close', () => console.log('port closed.'));
port.on('error', (error: any) => console.log('Serial port error: ' + error));
port.on('open', () => console.log('port open. Data rate: ' + port.baudRate));
port.on('data', (data: any) => {
  lastDataDate = new Date()

  if (new Date().getTime() - lastWatchDate.getTime() > 30000) {
    pattern.push(currentpattern)
    currentpattern = []
    fs.writeJson('./bootpattern.json', pattern)
    currentpattern.push(lastDataDate)
  } else {
    currentpattern.push(lastDataDate)
  }

  console.log('receiving data')
  watching = true
})

setInterval(() => {
  if (watching === true && (new Date().getTime() - lastWatchDate.getTime()) > 30000) {
    if (new Date().getTime() - lastDataDate.getTime() > 6000) {
      console.log('timeout reached')
      watching = false
      config.getnextboot().forEach((key: string) => {
        port.write(keypresses[key])
      })
      lastWatchDate = new Date()
    } else  {
      console.log(new Date().getTime() - lastDataDate.getTime(), 'without data')
    }
  } else {
  watching = false
  }
}, 500)
