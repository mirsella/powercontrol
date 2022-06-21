import { ref, Ref, computed } from 'vue'

// TODO: use ref for computed init

let token = ref("")
try {
  token.value = window.localStorage.getItem("token") || ""
  if (token.value.length === 0) {
    throw new Error("invalid token")
  }
} catch(e) {
  token = ref("")
}

const tokenComp = computed({
  get: () => token.value,
  set: (value: string) => {
    token.value = value
    window.localStorage.setItem("token", token.value)
  }
})


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
let presetComp = computed({
  get: () => preset.value,
  set: (value: preset) => {
    preset.value = value
    window.localStorage.setItem("preset", JSON.stringify(preset.value))
  }
})


let IPS = ref<string[]>([])
try {
  IPS.value = JSON.parse(window.localStorage.getItem("IPS") || "[]")
  if (Object.keys(IPS).length !== 0 && typeof IPS !== "object") {
    throw new Error("Invalid IPS")
  }
} catch (e) {
  IPS.value = []
}
let IPSComp = computed({
  get: () => IPS.value,
  set: (value: string[]) => {
    IPS.value = value
    console.log("IPS set", value)
    window.localStorage.setItem("IPS", JSON.stringify(IPS))
  }
})

export { tokenComp, presetComp, IPSComp }
