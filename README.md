# powercontrol

PC power/reset controller built around a Raspberry Pi, a relay board, and a Vue/Capacitor client.

It can also send serial key presses to the motherboard so the app can select the next GRUB entry before boot.

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
