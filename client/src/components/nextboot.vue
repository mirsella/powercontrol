<script setup lang="ts">
interface Props {
  preset: { windows: string[], linux: string[]},
  os: "windows" | "linux",
  savelocalstorage: Function
}

defineProps<Props>()


const presetEmoji = {
  "ENTER": "⏎",
  "DOWN": "↓",
  "UP": "↑",
}
</script>

<template>
  <div class="w-1/2 lg:(pl-2rem inline-flex) px-1rem">
    <img class="mobile max-w-12rem mx-2rem <lg:(mb-1rem max-w-5rem)" :src="'/src/assets/' + os + '.png'" :alt="os">
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
</template>
