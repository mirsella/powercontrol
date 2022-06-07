<script setup lang="ts">
import axios from 'redaxios' 
import { ref, computed, onMounted } from 'vue' 
import { Wifi } from '@capacitor-community/wifi';
import { Clipboard } from '@capacitor/clipboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { registerPlugin } from '@capacitor/core';
interface getIntentPlugin{ url(): Promise<{ value: string }>; }

const log = ref<string[]>([])

const getIntentPlugin = registerPlugin<getIntentPlugin>('getIntentPlugin');
getIntentPlugin.url().then(result => {
  const url = result.value.split("://")[1]
  log.value.push(url)
  if (["power", "reset", "reboot"].includes(url)) {
    // @ts-ignore: we are checking that url is "power" | "reset" | "reboot" already but TS seems to not detect it
    power(url)
  }
})

window.addEventListener("intentUrl", (value) => {
  const url = JSON.parse(JSON.stringify(value)).value.split("://")[1]
  log.value.push(url)
  if (["power", "reset", "reboot"].includes(url)) {
    power(url)
  }
})


let nativeIPs = <string[]>[]
Wifi.getAllIP()
  .then((e: object) => {
    const ips = Object.values(e)
    nativeIPs = ips.map((ip: string) => {
      return ip.split('.')[2]
    })
    searchIP()
  })

const error = ref("")
const nextboot = ref("")
const importModel = ref()
const presetEmoji = {
  "ENTER": "⏎",
  "DOWN": "↓",
  "UP": "↑",
}

const isTop = ref(true)
const settingsClick = () => {
  isTop.value = (window.scrollY <= 100)
  if (isTop.value) {
    isTop.value = false
    document.querySelector('#settings')?.scrollIntoView({ behavior: 'smooth' })
  } else {
    isTop.value = true
    document.querySelector('#top')?.scrollIntoView({ behavior: 'smooth' })
  }
}

let connected = ref('')
const connectedStyle = computed(() => {
  return {
    "header": {
      "bg-green-400": connected.value,
      "bg-rose-500": !connected.value
    },
    "button": {
      "bg-green-500 hover:bg-green-600": connected.value,
      "bg-rose-600 hover:bg-rose-700": !connected.value
    }
  }
})

let newip = ref('')
const newIPPrompt = computed(() => {
  return {
    "!text-green-400": Boolean(newip.value.match(IPregex)),
    "!text-rose-500": !newip.value.match(IPregex)
  }
})
const IPregex = /^https?:\/\/[0-9a-zA-Z\.]+(:[0-9]{2,}|[\/0-9a-zA-Z]+)$/
function newIP() {
  if (newip.value.length > 0 && newip.value.match(IPregex)) {
    Object(IPS.value).push(newip.value)
    newip.value = ''
    savelocalstorage()
    searchIP()
  }
}

const token = ref(window.localStorage.getItem("token") || "")
let IPS = ref<string[]>(JSON.parse(window.localStorage.getItem("IPS") || "[]"))
let preset = JSON.parse(window.localStorage.getItem("preset") || '{"windows": [], "linux": []}')

if (Object.keys(preset).length !== 2 && typeof preset.windows !== "object" && typeof preset.linux !== "object") {
  preset = ref({ "windows": [], "linux": [] })
  window.localStorage.setItem("preset", JSON.stringify(preset))
} else { 
  preset = ref(preset)
}

if (Object.keys(IPS).length !== 0 && typeof IPS.value !== "object") {
  IPS = ref([])
  window.localStorage.setItem("IPS", JSON.stringify(IPS))
}

function savelocalstorage () {
  window.localStorage.setItem("token", token.value)
  window.localStorage.setItem("IPS", JSON.stringify(IPS.value))
  window.localStorage.setItem("preset", JSON.stringify(preset.value))
}

function copySettings() {
  Clipboard.write({ string: JSON.stringify({token: token.value, ips: IPS.value, preset: preset.value}) })
}
function importSettings() {
  if (importModel.value !== "") {
    try {
      const parsed = JSON.parse(importModel.value)
      if (typeof parsed.token === "string" && typeof parsed.ips === "object" && typeof parsed.preset === "object") {
        token.value = parsed.token
        IPS.value = parsed.ips
        preset.value = parsed.preset
        searchIP()
        savelocalstorage()
      } else {
        throw new Error("Invalid JSON")
      }
    } catch (e: any) {
      console.log("couldn't parse ", importModel.value)
      error.value = e
    }
    importModel.value = ""
  }
}

onMounted(() => {
  searchIP()
  SplashScreen.hide()
})
async function searchIP() {
  error.value = ""
  document.querySelector('#refresh')?.classList.add('animate-spin')
  await Wifi.getAllIP()
    .then((e: object) => {
      const ips = Object.values(e)
      nativeIPs = ips.map((ip: string) => {
        return ip.split('.')[2]
      })
    })
  const ips = Array.from(IPS.value)
  for (const [index, ip] of ips.entries()) {
    if (ip.match(/\.XXX\./)) {
      ips.splice(index, 1)
      nativeIPs.forEach((nativeIP: string) => {
        ips.push(ip.replace(/\.XXX\./, `.${nativeIP}.`))
      })
    }
  }
  const httpRequests: Promise<void>[] = []
  ips.forEach((ip: string) => {
    const lip = ip
    httpRequests.push(
      axios.get(`${lip}/`, {headers: { Authorization: `Bearer ${token.value}` }})
      .then(res => {
        if (res.status === 200 && res.data === "powercontrol") {
          connected.value = lip
          error.value = ''
          getnextboot()
        }  
      })
    )
  })

  await Promise.all([
    Promise.any(httpRequests),
    new Promise(resolve => setTimeout(resolve, 1000))
  ])
    .then(() => document.querySelector('#refresh')?.classList.remove('animate-spin'))
}

function setnextboot(presetName: "windows" | "linux") {
  const nextpreset = preset.value[presetName]
  axios.post(`${connected.value}/setnextboot`, nextpreset, 
    {headers: { Authorization: `Bearer ${token.value}` }})
    .then(res => {
      if (res.status === 200 && JSON.stringify(res.data) === JSON.stringify(nextpreset)) {
        nextboot.value = presetName
        savelocalstorage()
        error.value = ''
      } else { error.value = JSON.stringify({status: res.status, data: res.data}) }
    })
    .catch(err => {
      return error.value = err.data
    })
}

function getnextboot() {
  axios.get(`${connected.value}/getnextboot`,
    {headers: { Authorization: `Bearer ${token.value}` }})
    .then(res => {
      if (res.status === 200) {
        error.value = ''
        if (JSON.stringify(res.data) == JSON.stringify(preset.value.linux)) {
          nextboot.value = "linux"
        } else if (JSON.stringify(res.data) == JSON.stringify(preset.value.windows)) {
          nextboot.value = "windows"
        } else {
          nextboot.value = ""
        }
      } else { error.value = JSON.stringify({status: res.status, data: res.data}) }
    })
    .catch(err => error.value = err.data)
}

function power(action: "power" | "reset" | "reboot") {
  connected.value !== "" &&
  axios.get(`${connected.value}/${action}`,
    {headers: { Authorization: `Bearer ${token.value}` }})
    .then(res => {
      if (res.status === 200 && res.data === action) {
        error.value = ''
        const el = document.querySelector(`#${action}`)
        el!.className += " duration-1000 shadow-full shadow-green-500"
        setTimeout(() => {
          el!.className = el!.className.replace(" duration-1000 shadow-full shadow-green-500", "")
        }, 1000)
      } else { error.value = JSON.stringify({status: res.status, data: res.data}) }
    })
    .catch(err => error.value = err.data)
}

</script>

<template>

  <header :class="connectedStyle.header" class="inline-flex justify-center items-center fixed top-0 h-4rem w-screen text-center transition">
    <span class="mx-1rem break-words dark:text-white text-black max-w-[70%]">{{ connected ? `${connected}` : "disconnected" }}</span>
    <button :class="connectedStyle.button" class="rounded px-6 h-3/5 transition" @click="searchIP">
      <svg id="refresh" class="dark:fill-white fill-black" height="24px" viewBox="0 0 24 24" width="24px" ><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M12,5V2L8,6l4,4V7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02c3.95-0.49,7-3.85,7-7.93C20,8.58,16.42,5,12,5z"/><path d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z"/></g></g></svg>
    </button>
  </header>

  <h5 v-if="error" class="text-rose-500 w-screen fixed top-4rem text-center bg-transparent">{{error}}</h5>

  <div id="top" class="h-screen dark:(bg-black text-white) pt-3rem ">
    <div class="w-screen my-5rem inline-flex justify-center items-center">
      <button id="reset" @click="power('reset')" class="transition button mx-5rem !mobile">
        <svg name="reset" class="mobile w-auto max-w-13rem" viewBox="0 0 24 24"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M12,5V2L8,6l4,4V7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02c3.95-0.49,7-3.85,7-7.93C20,8.58,16.42,5,12,5z"/><path d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z"/></g></g></svg>
      </button>
      <button id="reboot" @click="power('reboot')" class="transition button mx-5rem !mobile">
        <svg name="reboot" class="mobile w-auto max-w-12rem" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
          <text font-size='5' x="10" y="18">2×</text>
        </svg>
      </button>
      <button id="power" @click="power('power')" class="transition button mx-5rem !mobile">
        <svg name="power" class="mobile w-auto max-w-12rem" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
        </svg>
      </button>
    </div>

    <div class="w-screen my-5rem inline-flex justify-center items-center">
      <button :class="{ 'shadow-2xl shadow-true-gray-400' : nextboot === 'windows' }" @click="setnextboot('windows')" class="transition button mx-5rem !mobile">
        <img class="mobile w-auto max-w-12rem" src="./assets/windows.png" alt="windows icon">
      </button>
      <button :class="{ 'shadow-2xl shadow-true-gray-400' : nextboot === 'linux' }" @click="setnextboot('linux')" class="transition button mx-5rem !mobile">
        <img class="mobile w-auto max-w-12rem" src="./assets/linux.png" alt="linux icon">
      </button>
    </div>
    <span class="h-max overflow-scroll w-screen"> {{log}} </span>
  </div>

  <div id="settings" class="dark:(bg-black text-white) h-screen pt-6rem <sm:pt-5rem w-screen md:text-xl lg-text-3xl">

    <div class="text-center px-2rem">
      <span class="text-3xl mx-5">Settings</span>
      <button @click="copySettings" class="button transition px-1rem py-2 my-2 md:m-2rem">📋export</button>
      <input class="button transition px-1rem py-2 my-2 <sm:(w-full px-1rem)" @input="importSettings" v-model="importModel" type="text" placeholder="paste settings here" name="settings" id="settings"/>
    </div>

      <div class="w-screen my-1rem px-2rem">
        <input class="button transition w-full px-1rem py-2" type="text" placeholder="token" v-model="token" @change="savelocalstorage">
      </div>

      <div class="pt-0 w-screen lg:h-2/5 h-1/3 flex flex-wrap content-start md:px-4rem <lg:justify-center overflow-y-scroll">
        <div class="flex h-min my-3 <sm:(w-screen px-2rem)">
          <input class="mr-2 text-white w-full px-2 transition button" type="text" @keyup.enter="newIP" :class="newIPPrompt" v-model="newip" placeholder="new IP">
          <button class="transition button rounded-lg p-2 mx-1" @click="newIP">➕</button>
        </div>
        <div class="flex text-center m-3 wrap h-min <sm:(mx-0 w-screen px-2rem)" v-for="(ip, index) in IPS" :key="ip">
          <span class="w-full h-full overflow-y-scroll p-2">{{ip}}</span>
          <button class="transition button rounded-lg p-2 mx-1" @click="IPS.splice(index, 1) && savelocalstorage()">❌</button>
        </div>
      </div>

      <div class="w-screen inline-flex mt-1rem">
        <div class="w-1/2 lg:(pl-2rem inline-flex) px-1rem">
          <img class="mobile max-w-10rem mx-2rem <lg:(mb-1rem max-w-5rem)" src="./assets/windows.png" alt="windows icon">
          <div class="lg:inline-flex h-max-13rem overflow-auto">
            <div class="w-full inline-flex lg:(flex flex-wrap w-3rem)" v-for="(key, index) in preset.windows" :key="key">
              <div class="lg:(h-[60%] w-full) w-2/3 m-1 button flex justify-center items-center">
                <h6>{{ Object(presetEmoji)[key] }}</h6>
              </div>
              <button class="lg:(self-end h-[30%] w-full) w-1/3 h-full m-1 button transition" @click="preset.windows.splice(index, 1); savelocalstorage()">❌</button>
            </div>
            <div class="inline-flex w-full lg:(flex flex-wrap w-3rem)">
              <button class="m-1 transition button w-full" @click="preset.windows.push('UP'); savelocalstorage()">{{presetEmoji.UP}}</button>
              <button class="m-1 transition button w-full" @click="preset.windows.push('ENTER'); savelocalstorage()">{{presetEmoji.ENTER}}</button>
              <button class="m-1 transition button w-full" @click="preset.windows.push('DOWN'); savelocalstorage()">{{presetEmoji.DOWN}}</button>
            </div>
          </div>
        </div>

        <div class="w-1/2 lg:(pl-2rem inline-flex) px-1rem">
          <img class="mobile max-w-12rem mx-2rem <lg:(mb-1rem max-w-5rem)" src="./assets/linux.png" alt="linux icon">
          <div class="lg:inline-flex h-max-13rem overflow-auto">
            <div class="w-full inline-flex lg:(flex flex-wrap w-3rem)" v-for="(key, index) in preset.linux" :key="key">
              <div class="lg:(h-[60%] w-full) w-2/3 m-1 button flex justify-center items-center">
                <h6>{{ Object(presetEmoji)[key] }}</h6>
              </div>
              <button class="lg:(self-end h-[30%] w-full) w-1/3 h-full m-1 button transition" @click="preset.linux.splice(index, 1); savelocalstorage()">❌</button>
            </div>
            <div class="inline-flex w-full lg:(flex flex-wrap w-3rem)">
              <button class="m-1 transition button w-full" @click="preset.linux.push('UP'); savelocalstorage()">{{presetEmoji.UP}}</button>
              <button class="m-1 transition button w-full" @click="preset.linux.push('ENTER'); savelocalstorage()">{{presetEmoji.ENTER}}</button>
              <button class="m-1 transition button w-full" @click="preset.linux.push('DOWN'); savelocalstorage()">{{presetEmoji.DOWN}}</button>
            </div>
          </div>
        </div>
      </div>
  </div>

  <button @click="settingsClick" class="w-3rem h-3rem p-2 rounded-full bg-pink-600 right-5 bottom-5 fixed text-white">
    <svg class="dark:fill-black fill-white" v-if="isTop" name="settings" viewBox="0 0 489.8 489.8" style="enable-background:new 0 0 489.8 489.8;"> <g> <g> <g> <path d="M469.1,182.95h-38.2c-3.1-8.3-6.2-16.6-10.3-23.8l26.9-26.9c8.3-8.2,8.3-20.6,0-28.9l-60-60c-8.2-8.3-20.6-8.3-28.9,0 l-27.9,27.9c-7.2-3.1-15.5-6.2-22.7-9.3v-39.3c0-11.4-9.3-20.7-20.7-20.7h-84.8c-11.4,0-20.7,9.3-20.7,20.7v37.1 c-8.2,3.1-15.5,6.2-22.7,9.3l-27.9-27.9c-8.2-8.3-20.6-8.3-28.9,0l-60,60c-8.3,8.2-8.3,20.6,0,28.9l26.9,26.9 c-4.1,8.3-7.2,15.5-10.3,23.8H20.7c-11.4,0-20.7,9.3-20.7,20.7v84.8c0,11.4,9.3,20.7,20.7,20.7h35.1c3.1,8.3,6.2,16.5,10.3,24.8 l-25.8,25.8c-4.1,4.1-11.6,16.3,0,28.9l60,60c8.2,8.3,20.6,8.3,28.9,0l24.8-24.8c8.2,5.2,16.5,8.3,25.8,11.4v34.1 c0,11.4,9.3,20.7,20.7,20.7h84.8c11.4,0,20.7-9.3,19.7-18.5v-34.1c8.2-3.1,17.5-7.3,25.8-11.4l24.8,24.8c8.2,8.3,20.6,8.3,28.9,0 l60-60c8.3-8.2,8.3-20.6,0-28.9l-25.8-25.8c4.1-8.3,7.2-16.5,10.3-24.8h40.1c11.4,0,20.7-9.3,20.7-20.7v-84.8 C489.8,192.25,480.5,182.95,469.1,182.95z M445.6,266.75h-31c-9.3,0-17.5,6.2-19.6,15.5c-4.2,15.5-9.3,30-17.6,43.4 c-5.2,8.3-3.1,18.6,3.1,24.8l21.7,21.7l-31,31l-20.7-20.7c-6.2-7.2-16.5-8.3-24.8-3.1c-14.5,8.3-29,14.5-44.5,18.6 c-9.3,2-15.5,10.3-15.5,19.6v30h-44.5v-0.1h-1v-30c0-9.3-6.2-17.5-15.5-19.6c-15.6-4.1-31.1-10.3-44.5-18.6 c-8.3-5.2-18.6-3.1-24.8,3.1l-20.7,20.7l-31-31l21.7-21.7c6.2-7.2,8.3-16.5,3.1-24.8c-8.3-13.4-14.5-27.9-17.6-43.4 c-2-9.3-10.3-15.5-19.6-15.5h-31v-44.5h33.1c9.3,0,17.5-6.2,19.6-15.5c3.1-14.5,9.3-28,17.6-41.4c5.2-8.3,3.1-18.6-3.1-24.8 l-23.8-23.8l31-31l23.8,23.8c7.2,6.2,16.5,8.3,24.8,3.1c13.5-7.2,26.9-13.4,41.4-16.5c9.3-2,15.5-10.3,15.5-19.6v-34.1h44.5v35.2 c0,9.3,6.2,17.5,15.5,19.6c14.5,3.1,29,9.3,41.4,16.5c8.3,5.2,18.6,3.1,24.8-3.1l24.8-24.8l31,31l-23.8,23.8 c-7.2,6.2-8.3,16.5-3.1,24.8c7.3,12.5,13.5,26.9,17.6,41.4c2,9.3,10.3,15.5,19.6,15.5h33.1V266.75z"/> <path d="M242.9,132.25c-62,0-112.7,50.7-112.7,112.7s50.7,112.7,112.7,112.7c62.1,0,112.7-50.7,112.7-112.7 S304.9,132.25,242.9,132.25z M242.9,317.35c-39.3,0-72.4-32.1-72.4-72.4c0-39.3,32.1-72.4,72.4-72.4c40.3,0,72.4,32.1,72.4,72.4 C315.3,284.25,282.2,317.35,242.9,317.35z"/> </g> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>
    <svg class="dark:fill-black fill-white" v-else name="arrow" viewBox="0 0 490 490" style="enable-background:new 0 0 490 490;"> <g> <g> <polygon points="0,332.668 245.004,82.631 490,332.668 413.507,407.369 245.004,235.402 76.493,407.369 		"/> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>
  </button>

</template>

<style>
body {
  overflow-y: hidden;
}
input, textarea, button, select, a { -webkit-tap-highlight-color: rgba(0,0,0,0); }
</style>
