import config from './config'

import { SerialPort } from 'serialport'
const port = new SerialPort({ path: "/dev/ttyS0", baudRate: 9600 })

const keypresses: Record<string, any> = {
	"ESC": [0x1b],
	"UP": [0x1b, 0x5b, 0x41],
	"DOWN": [0x1b, 0x5b, 0x42],
	"ENTER": "\n"
}

let firstWait = false
let dataAfterFirstWait = false
let secondWait = false
let watching = true
let lastDataDate = new Date(0)
port.on('close', () => console.log('port closed.'));
port.on('error', (error: any) => console.log('Serial port error: ' + error));
port.on('open', () => console.log('port open. Data rate: ' + port.baudRate));
port.on('data', () => {
	lastDataDate = new Date()
	watching = true
	if (firstWait) {
		console.log('data after first wait')
		dataAfterFirstWait = true
	}
})

// my boot pattern to wait for grub
// wait for more than 5sec without data
// wait for new data
// wait for more than 2sec from last data
// send keypress
setInterval(() => {
	if (watching) {
		if (new Date().getTime() - lastDataDate.getTime() > 10000) {
			console.log("no data for 10sec, resetting state")
			firstWait = false
			dataAfterFirstWait = false
			secondWait = false
			watching = false
			return
		}

		if ((!firstWait && !dataAfterFirstWait && !secondWait) && (new Date().getTime() - lastDataDate.getTime() > 5000)) {
			console.log("first wait")
			firstWait = true
		}

		if ((firstWait && dataAfterFirstWait && !secondWait) && (new Date().getTime() - lastDataDate.getTime() > 2000)) {
			console.log("second wait")
			secondWait = true
		}

		if (firstWait && dataAfterFirstWait && secondWait) {
			console.log("Sending keypress")
			// port.write(keypresses[config.keypress])
			config.nextboot.forEach((key: string) => {
				port.write(keypresses[key])
			})
			firstWait = false
			dataAfterFirstWait = false
			secondWait = false
		}
	}
}, 100)
