let SerialPort = require('serialport');
const fs = require('fs')

let port = new SerialPort('/dev/ttyS0', {baudRate:9600});

let lastDataDate = new Date()
let lastWatchDate = new Date(0,0,0,0,0,0,0)
let watching = false
port.on('close', () => console.log('port closed.'));
port.on('error', (error: any) => console.log('Serial port error: ' + error));
port.on('open', () => console.log('port open. Data rate: ' + port.baudRate));
port.on('data', (data: any) => {
  lastDataDate = new Date()
  console.log('receiving data')
  watching = true
})

setInterval(() => {
  if (watching === true && (new Date().getTime() - lastWatchDate.getTime()) > 30000) {
    if (new Date().getTime() - lastDataDate.getTime() > 6000) {
      console.log('timeout reached')
      watching = false
      // write keypresses
      lastWatchDate = new Date()
    } else  {
      console.log(new Date().getTime() - lastDataDate.getTime(), 'without data')
    }
  } else {
    watching = false
  }
}, 1000)
