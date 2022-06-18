<script setup lang="ts">
interface Props {
  preset: { windows: string[], linux: string[]},
  os: "windows" | "linux"
}

defineProps<Props>()


const presetEmoji = {
  "ENTER": "⏎",
  "DOWN": "↓",
  "UP": "↑",
}
</script>

<template>
  <div class="w-1/2 lg:(pr-4rem inline-flex) px-1rem inline-block align-top">
    <div class="w-full px-10 max-w-18rem <lg:(mb-1rem max-w-13rem) mx-auto">
      <img v-if="os === 'windows'" class="max-w-full" src="../assets/windows.png" :alt="os">
      <img v-else class="max-w-full" src="../assets/linux.png" :alt="os">
    </div>
    <div class="lg:inline-flex max-h-13rem max-w-20rem overflow-auto mx-auto">
      <div class="w-full inline-flex lg:(flex flex-wrap w-3rem)" v-for="(key, index) in preset[os]" :key="key">
        <div class="lg:(h-[60%] w-full) w-2/3 m-1 button flex justify-center items-center">
          <h6>{{ Object(presetEmoji)[key] }}</h6>
        </div>
        <button class="lg:(self-end h-[30%] w-full) w-1/3 h-full m-1 button transition" @click="preset[os].splice(index, 1)">❌</button>
      </div>
      <div class="inline-flex w-full lg:(flex flex-wrap w-3rem)">
        <button class="m-1 transition button w-full" @click="preset[os].push('UP')">{{presetEmoji.UP}}</button>
        <button class="m-1 transition button w-full" @click="preset[os].push('ENTER')">{{presetEmoji.ENTER}}</button>
        <button class="m-1 transition button w-full" @click="preset[os].push('DOWN')">{{presetEmoji.DOWN}}</button>
      </div>
    </div>
  </div>
</template>
