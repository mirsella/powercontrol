import { ref } from 'vue'

// todo: proxy so we don't have to use savelocalstorage()

const token = ref(window.localStorage.getItem("token") || "")
let preset = JSON.parse(window.localStorage.getItem("preset") || '{"windows": [], "linux": []}')

if (Object.keys(preset).length !== 2 && typeof preset.windows !== "object" && typeof preset.linux !== "object") {
  preset = ref({ "windows": [], "linux": [] })
  window.localStorage.setItem("preset", JSON.stringify(preset))
} else { 
  preset = ref(preset)
}


let IPS = ref<string[]>(JSON.parse(window.localStorage.getItem("IPS") || "[]"))
if (Object.keys(IPS).length !== 0 && typeof IPS.value !== "object") {
  IPS = ref([])
  window.localStorage.setItem("IPS", JSON.stringify(IPS))
}

function savelocalstorage () {
  window.localStorage.setItem("token", token.value)
  window.localStorage.setItem("IPS", JSON.stringify(IPS.value))
  window.localStorage.setItem("preset", JSON.stringify(preset.value))
}

export { token, preset, IPS, savelocalstorage }
