import { registerPlugin } from '@capacitor/core';
import { power, setnextboot } from './utils'
import { Ref } from 'vue'

interface getIntentPlugin{ url(): Promise<{ value: string }>; }
const getIntentPlugin = registerPlugin<getIntentPlugin>('getIntentPlugin');

function handleIntentUrl(url: string) {
  if (["windows", "linux"].includes(url)) {
    // @ts-ignore: we are checking that url is "windows" | "linux" already but TS seems to not detect it
    setnextboot(url, nextboot, error)
  } else if (["power", "reset", "reboot"].includes(url)) {
    // @ts-ignore: we are checking that url is "power" | "reset" | "reboot" already but TS seems to not detect it
    power(url, error)
  }
}

window.addEventListener("intentUrl", (value) => {
  handleIntentUrl(JSON.parse(JSON.stringify(value)).value.split("://")[1])
})

let nextboot: Ref
let error: Ref
function getIntentPluginUrl(nextbootR: Ref, errorR: Ref) {
  nextboot = nextbootR
  error = errorR
  getIntentPlugin.url().then(result => {
    handleIntentUrl(result.value.split("://")[1])
  })
}

export default getIntentPluginUrl
