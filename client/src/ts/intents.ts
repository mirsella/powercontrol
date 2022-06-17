import { registerPlugin } from '@capacitor/core';
import { power, setnextboot } from './utils'
import { Ref } from 'vue'

interface getIntentPlugin{ url(): Promise<{ value: string }>; }
const getIntentPlugin = registerPlugin<getIntentPlugin>('getIntentPlugin');

function handleIntentUrl(url: string) {
  if (["windows", "linux"].includes(url)) {
    // @ts-ignore: we are checking that url is "windows" | "linux" already but TS seems to not detect it
    setnextboot(url, nextboot)
  } else if (["power", "reset", "reboot"].includes(url)) {
    // @ts-ignore: we are checking that url is "power" | "reset" | "reboot" already but TS seems to not detect it
    power(url)
  }
}

window.addEventListener("intentUrl", (value) => {
  handleIntentUrl(JSON.parse(JSON.stringify(value)).value.split("://")[1])
})

let nextboot: Ref
function getIntentPluginUrl(nextbootR: Ref) {
  nextboot = nextbootR
  getIntentPlugin.url().then(result => {
    handleIntentUrl(result.value.split("://")[1])
  })
}

export { getIntentPluginUrl }
