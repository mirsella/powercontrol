<script setup lang="ts">
import axios from 'redaxios' 
import { ref, computed, onMounted } from 'vue' 
import { Clipboard } from '@capacitor/clipboard';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

import NextbootSettings from './components/nextbootSettings.vue'
import SettingsToggle from './components/settingsToggle.vue'

import * as intents from './ts/intents'
import getNativeIps from './ts/capWifi'
import { connected, connectedStyle, newip, newIP, newIPPrompt } from './ts/ipUtils'
import { token, IPS, preset, savelocalstorage } from './ts/localStorage'

const error = ref("")
const nextboot = ref("")
const importModel = ref()

intents.init(power, setnextboot)

const allIPs = computed(async () => {
  const final = IPS.value.filter(ip => ! ip.match(/\.XXX\./))
  final.concat(await getNativeIps(IPS.value))
  error.value += "incomputed:"+final
  return final
})

function copySettings() {
  Clipboard.write({ string: JSON.stringify({ ips: IPS.value, preset: preset.value, token: token.value }) })
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

onMounted(async () => {
  SplashScreen.hide()
  if (Capacitor.isNativePlatform()) {
    searchIP()
      .then(() => {
        intents.getIntentPluginUrl()
      })
  }
})

async function searchIP() {
  document.querySelector('#refresh')?.classList.add('animate-spin')
  const httpRequests: Promise<void>[] = [];

  (await allIPs.value).forEach((ip: string) => {
    error.value += ip
    const lip = ip
    if (lip.match(/\.XXX\./)) { return }

    httpRequests.push(
      axios.get(`${lip}/`, {headers: { Authorization: `Bearer ${token.value}` }})
      .then(res => {
        if (res.status === 200 && res.data === "powercontrol") {
          connected.value = lip
          error.value = ""
          getnextboot()
        }  
      })
    )
  })
  httpRequests.push(new Promise(resolve => setTimeout(resolve, 10000)))
  await Promise.all([
    Promise.any(httpRequests),
    new Promise(resolve => setTimeout(resolve, 1000))
  ])
    .then(() => {
      document.querySelector('#refresh')?.classList.remove('animate-spin')
    })
}

function setnextboot(presetName: "windows" | "linux") {
  const nextpreset = preset.value[presetName]
  axios.post(`${connected.value}/setnextboot`, nextpreset, 
    {headers: { Authorization: `Bearer ${token.value}` }})
    .then(res => {
      if (res.status === 200 && JSON.stringify(res.data) === JSON.stringify(nextpreset)) {
        nextboot.value = presetName
        savelocalstorage()
        error.value = ""
      } // else { error.value = JSON.stringify({status: res.status, data: res.data}) }
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
        error.value = ""
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
  error.value+="inpower"+connected.value
  connected.value !== "" &&
    axios.get(`${connected.value}/${action}`,
      {headers: { Authorization: `Bearer ${token.value}` }})
    .then(res => {
      if (res.status === 200 && res.data === action) {
        error.value = ""
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
    <span v-if="error" class="text-rose-500 overflow-ellipsis w-screen text-center bg-transparent">{{error}}</span>
    <span class="overflow-ellipsis">{{allIPs}}</span>

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

      <div class="pt-0 w-screen lg:h-2/5 h-1/3 flex flex-wrap content-start md:px-2rem <lg:justify-center overflow-y-scroll">
        <div class="flex h-min my-3 <sm:(w-screen px-2rem)">
          <input class="mr-2 text-white w-full px-2 transition button" type="text" @keyup.enter="newIP" :class="newIPPrompt" v-model="newip" placeholder="new IP">
          <button class="transition button rounded-lg p-2 mx-1" @click="newIP">➕</button>
        </div>
        <div class="flex text-center m-3 wrap h-min <sm:(mx-0 w-screen px-2rem)" v-for="(ip, index) in IPS" :key="ip">
          <span class="w-full h-full overflow-y-scroll p-2">{{ip}}</span>
          <button class="transition button rounded-lg p-2 mx-1" @click="IPS.splice(index, 1) && savelocalstorage()">❌</button>
        </div>
      </div>

      <NextbootSettings :preset="preset" os="windows" :savelocalstorage="savelocalstorage"/>
      <NextbootSettings :preset="preset" os="linux" :savelocalstorage="savelocalstorage"/>

      <SettingsToggle/>
  </div>

</template>

<style>
body {
  overflow-y: hidden;
}
input, textarea, button, select, a { -webkit-tap-highlight-color: rgba(0,0,0,0); }
</style>
