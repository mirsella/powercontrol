<script setup lang="ts">
import { ref, onMounted } from 'vue' 
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import axios from 'redaxios'

import NextbootSettings from './components/nextbootSettings.vue'
import SettingsToggle from './components/settingsToggle.vue'
import ImportSettings from './components/importSettings.vue'

import getIntentPluginUrl from './ts/intents'
import { connected, connectedStyle, newip, newIP, newIPPrompt, } from './ts/ipUtils'
import { token, IPS, savelocalstorage } from './ts/localStorage'
import { setnextboot, power, searchIP } from './ts/utils'

const error = ref("")
const errorFn = () => error
const nextboot = ref("")
const nextbootFn = () => nextboot
const	host_status = ref("unknow")

function update_host_status()
{
	if (connected.value == "")
	{
		host_status.value = "unknown"
		return
	}
	host_status.value = "checking"
	axios.get(`${connected.value}/host_online`, { headers: {Authorization: `Bearer ${token.value}` }})
		.then((response) => {
			if (response.data == true)
			host_status.value = "online"
			else
			host_status.value = "offline"
		})
		.catch(err => {
			host_status.value = "offline"
			error.value = err.data
		})
}

onMounted(async () => {
	SplashScreen.hide()
	searchIP(nextboot, error)
		.then(() => {
			if (Capacitor.isNativePlatform()) {
				getIntentPluginUrl(nextboot, error)
			}
			update_host_status()
		})
})

</script>

<template>

	<header :class="connectedStyle.header" class="inline-flex justify-center items-center fixed top-0 h-4rem w-screen text-center transition">
		<span class="mx-1rem break-words dark:text-white text-black max-w-[70%]">{{ connected ? `${connected}` : "disconnected" }}</span>
		<button :class="connectedStyle.button" class="rounded px-6 h-3/5 transition" @click="searchIP(nextbootFn(), errorFn())">
			<svg id="refresh" class="dark:fill-white fill-black" height="24px" viewBox="0 0 24 24" width="24px" ><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M12,5V2L8,6l4,4V7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02c3.95-0.49,7-3.85,7-7.93C20,8.58,16.42,5,12,5z"/><path d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z"/></g></g></svg>
		</button>
	</header>

	<div id="top" class="h-screen dark:(bg-black text-white) pt-4rem ">

		<div class="w-full flex justify-center mt-2">
			<h1 @click="update_host_status" class="text-xl text-center rounded transition button break-words p-1 px-2">is host online: {{host_status}}</h1>
		</div>

		<div class="w-screen my-2rem inline-flex justify-center items-center">
			<button id="reset" @click="power('reset', errorFn())" class="transition button !mobile">
				<svg name="reset" class="mobile w-auto max-w-12rem" viewBox="0 0 24 24"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M12,5V2L8,6l4,4V7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02c3.95-0.49,7-3.85,7-7.93C20,8.58,16.42,5,12,5z"/><path d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z"/></g></g></svg>
			</button>
			<button id="reboot" @click="power('reboot', errorFn())" class="transition button !mobile">
				<svg name="reboot" class="mobile w-auto max-w-12rem" viewBox="0 0 24 24">
					<path d="M0 0h24v24H0z" fill="none"/>
					<path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
					<text font-size='5' x="10" y="18">2×</text>
				</svg>
			</button>
			<button id="power" @click="power('power', errorFn())" class="transition button !mobile">
				<svg name="power" class="mobile w-auto max-w-12rem" viewBox="0 0 24 24">
					<path d="M0 0h24v24H0z" fill="none"/>
					<path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
				</svg>
			</button>
		</div>

		<div class="w-screen my-2rem inline-flex justify-center items-center">
			<button :class="{ 'shadow-2xl shadow-true-gray-400' : nextboot === 'windows' }" @click="setnextboot('windows', nextbootFn(), errorFn())" class="transition button mx-5rem !mobile">
				<img class="mobile w-auto max-w-12rem" src="./assets/windows.png" alt="windows icon">
			</button>
			<button :class="{ 'shadow-2xl shadow-true-gray-400' : nextboot === 'linux' }" @click="setnextboot('linux', nextbootFn(), errorFn())" class="transition button mx-5rem !mobile">
				<img class="mobile w-auto max-w-12rem" src="./assets/linux.png" alt="linux icon">
			</button>
		</div>
		<span v-if="error" class="text-rose-500 overflow-ellipsis w-screen text-center bg-transparent">{{error}}</span>

	</div>

	<div id="settings" class="dark:(bg-black text-white) h-screen pt-5rem <sm:w-screen md:text-xl lg-text-3xl">

			<ImportSettings :nextboot="nextbootFn" :error="errorFn"/>

			<div class="w-screen my-1rem px-2rem">
				<input class="button transition w-full px-1rem py-2" type="text" placeholder="token" v-model="token" @change="savelocalstorage">
			</div>

			<div class="pt-0 w-screen lg:h-2/5 h-1/3 flex flex-wrap content-start md:px-2rem <lg:justify-center overflow-y-scroll">
					<div class="flex h-min my-3 <sm:(w-screen px-2rem)">
							<input class="mr-2 text-white w-full px-2 transition button" type="text" @keyup.enter="newIP(nextbootFn(), errorFn())" :class="newIPPrompt" v-model="newip" placeholder="new IP">
							<button class="transition button rounded-lg p-2 mx-1" @click="newIP(nextbootFn(), errorFn())">➕</button>
						</div>
						<div class="flex text-center m-3 wrap h-min <sm:(mx-0 w-screen px-2rem)" v-for="(ip, index) in IPS" :key="ip">
								<span class="w-full h-full overflow-y-scroll p-2">{{ip}}</span>
								<button class="transition button rounded-lg p-2 mx-1" @click="IPS.splice(index, 1) && savelocalstorage()">❌</button>
							</div>
						</div>

						<NextbootSettings os="windows" />
						<NextbootSettings os="linux" />

						<SettingsToggle/>
					</div>

</template>

<style>
body {
	overflow-y: hidden;
}
input, textarea, button, select, a { -webkit-tap-highlight-color: rgba(0,0,0,0); }
</style>
