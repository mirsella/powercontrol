# powercontrol

PC power/reset controller built around a Raspberry Pi, a relay board, and a Vue/Capacitor client.

It can also send serial key presses to the motherboard so the app can select the next GRUB entry before boot.

## How It Works

The server is a small Express API running on the Raspberry Pi. It controls GPIO pins connected to a relay board for power and reset, and it can also write HID key presses to `/dev/hidg0` to drive the GRUB menu before the PC starts.

The client is a Vue 3 + Capacitor app that discovers the server, stores connection details locally, and exposes actions such as power, reset, reboot, next-boot selection, and host online status.

In practice the hardware chain is:

`motherboard front-panel pins <-> relay board <-> Raspberry Pi <-> client app`

## Quick start

1. Copy `server/config.example.json` to `server/config.json`.
2. Adjust the GPIO pins, `host_ip`, and `token`.
3. Start the server with `cd server && npm install && npm run dev`.
4. Start the client with `cd client && npm install && npm run dev`.

## Android build

```bash
cd client
npm run android
```

## Config Notes

- `shutdownTime` controls the delay used for reboot-style flows.
- `menuTime` controls when GRUB key presses are sent.
- `nextboot` is the boot-menu key sequence to send.
- Authentication is a single shared bearer token.

## Pictures

<p float="left">
  <img src="./pictures/w1.png" width=20%>
  <img src="./pictures/w2.png" width=20%>
  <img src="./pictures/b1.png" width=20%>
  <img src="./pictures/b2.png" width=20%>
</p>
<p float="left">
  <img src="./pictures/rpi.jpg" width=40%>
  <img src="./pictures/relay.jpg" width=40%>
</p>
