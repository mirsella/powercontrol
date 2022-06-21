<script setup lang="ts">
import { Clipboard } from '@capacitor/clipboard';
import { token, IPS, preset, savelocalstorage } from '../ts/localStorage'
import { ref, Ref } from 'vue'
import { searchIP } from '../ts/utils'

const props = defineProps<{ nextboot: Ref, error: Ref }>()

const importModel = ref()

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
        searchIP(props.nextboot, props.error)
        savelocalstorage()
      } else {
        throw new Error("Invalid JSON")
      }
    } catch (e: any) {
      console.log("couldn't parse ", importModel.value)
      props.error.value = e
    }
    importModel.value = ""
  }
}
</script>

<template>
  <div class="text-center px-2rem">
    <span class="text-3xl mx-5">Settings</span>
    <button @click="copySettings" class="button transition px-1rem py-2 m-2 md:m-2rem">📋export</button>
    <input class="button transition px-1rem py-2 my-2 <sm:(w-full px-1rem)" @input="importSettings" v-model="importModel" type="text" placeholder="paste settings here" name="settings" id="settings"/>
  </div>
</template>
