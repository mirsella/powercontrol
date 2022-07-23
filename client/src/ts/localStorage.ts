import { ref, Ref } from 'vue'

let token = ref("")
try {
  token.value = window.localStorage.getItem("token") || ""
  if (token.value.length === 0) {
    throw new Error("invalid token")
  }
} catch(e) {
  token = ref("")
}


type preset = { windows: string[], linux: string[] }
let preset: Ref<preset> = ref({ windows: [], linux: [] })
try {
  preset.value = JSON.parse(window.localStorage.getItem("preset") || '{"windows": [], "linux": []}')
  if (Object.keys(preset).length !== 2 && typeof preset.value.windows !== "object" && typeof preset.value.linux !== "object") {
    throw new Error("Invalid preset")
  }
} catch (e) {
  preset.value = { windows: [], linux: [] }
}


let IPS = ref<string[]>([])
try {
  IPS.value = JSON.parse(window.localStorage.getItem("IPS") || "[]")
  if (Object.keys(IPS).length !== 0 && typeof IPS !== "object") {
    throw new Error("Invalid IPS")
  }
} catch (e) {
  IPS.value = []
}

function savelocalstorage () {
  window.localStorage.setItem("token", token.value)
  window.localStorage.setItem("IPS", JSON.stringify(IPS.value))
  window.localStorage.setItem("preset", JSON.stringify(preset.value))
}

export { token, preset, IPS, savelocalstorage }
