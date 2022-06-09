import { registerPlugin } from '@capacitor/core';

interface getIntentPlugin{ url(): Promise<{ value: string }>; }
const getIntentPlugin = registerPlugin<getIntentPlugin>('getIntentPlugin');

let power: Function
let setnextboot: Function

function handleIntentUrl(url: string) {
  if (["windows", "linux"].includes(url)) {
    // @ts-ignore: we are checking that url is "windows" | "linux" already but TS seems to not detect it
    setnextboot(url)
  } else if (["power", "reset", "reboot"].includes(url)) {
    // @ts-ignore: we are checking that url is "power" | "reset" | "reboot" already but TS seems to not detect it
    power(url)
  }
}

window.addEventListener("intentUrl", (value) => {
  handleIntentUrl(JSON.parse(JSON.stringify(value)).value.split("://")[1])
})

function getIntentPluginUrl() {
  getIntentPlugin.url().then(result => {
    handleIntentUrl(result.value.split("://")[1])
  })
}

function init(Ipower: Function, Isetnextboot: Function) {
  power = Ipower
  setnextboot = Isetnextboot
}

export { init, getIntentPluginUrl }
