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

let pattern: any[]
try { pattern = fs.readJsonSync('./bootpattern.json')
} catch { pattern = [] }

let currentpattern: Date[] = []
process.on('SIGINT', () => {
  pattern.push(currentpattern)
  fs.writeJson('./bootpattern.json', pattern)
  process.exit();
});

let lastDataDate = new Date()
let lastWatchDate = new Date(0,0,0,0,0,0,0)
let lastBootDate = new Date(0,0,0,0,0,0,0)
let watching = false
port.on('close', () => console.log('port closed.'));
port.on('error', (error: any) => console.log('Serial port error: ' + error));
port.on('open', () => console.log('port open. Data rate: ' + port.baudRate));
port.on('data', (data: any) => {
  lastDataDate = new Date()
  // normaly 20000
  if ((new Date().getTime() - lastWatchDate.getTime()) > 10000) {
    watching = true
  }

  if (watching) {
    if (new Date().getTime() - lastBootDate.getTime() > 10000) {
      lastBootDate = new Date()
      console.log('receiving data new boot')
      pattern.push(currentpattern)
      currentpattern = []
      currentpattern.push(lastDataDate)
    } else {
      console.log('receiving data same boot')
      currentpattern.push(lastDataDate)
    }
    // console.log('after:', currentpattern, pattern)
  }

  // console.log('receiving data')
})

setInterval(() => {

  if (watching === true) {
    if (new Date().getTime() - lastDataDate.getTime() > 7000) {
      console.log("writing bootpattern.json", pattern)
      fs.writeJson('./bootpattern.json', pattern)
      console.log('timeout reached', new Date().toString())
      watching = false
      config.nextboot.forEach((key: string) => {
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


