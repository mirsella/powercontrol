import { computed } from 'vue'

// TODO: use ref for computed init

let token = ""
const tokenComp = computed({
  get: () => {
    try {
      token = window.localStorage.getItem("token") || ""
      if (token.length === 0) {
        throw new Error("invalid token")
      }
    } catch(e) {
      token = ""
    }
    return token
  },
  set: (value: string) => {
    token = value
    window.localStorage.setItem("token", token)
  }
})


type preset = { windows: string[], linux: string[] }
let preset: preset
let presetComp = computed({
  get: () => {
    try {
      preset = JSON.parse(window.localStorage.getItem("preset") || '{"windows": [], "linux": []}')
      if (Object.keys(preset).length !== 2 && typeof preset.windows !== "object" && typeof preset.linux !== "object") {
        throw new Error("Invalid preset")
      }
    } catch (e) {
      preset = { windows: [], linux: [] }
    }
    return preset
  },
  set: (value: preset) => {
    preset = value
    window.localStorage.setItem("preset", JSON.stringify(preset))
  }
})


let IPS: string[] = []

let IPSComp = computed({
  get: () => {
    try {
      IPS = JSON.parse(window.localStorage.getItem("IPS") || "[]")
      if (Object.keys(IPS).length !== 0 && typeof IPS !== "object") {
        throw new Error("Invalid IPS")
      }
    } catch (e) {
      IPS = []
    }
    return IPS
  },
  set: (value: string[]) => {
    IPS = value
    window.localStorage.setItem("IPS", JSON.stringify(IPS))
  }
})

export { tokenComp, presetComp, IPSComp }
