import { ref, computed } from 'vue'

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

const IPregex = /^https?:\/\/[0-9a-zA-Z\.]+(:[0-9]{2,}|[\/0-9a-zA-Z]+)$/
const newIPPrompt = computed(() => {
  return {
    "!text-green-400": Boolean(newip.value.match(IPregex)),
    "!text-rose-500": !newip.value.match(IPregex)
  }
})

let IPS = ref<string[]>(JSON.parse(window.localStorage.getItem("IPS") || "[]"))
const ips: string[] = IPS.value.filter(ip => ! ip.match(/\.XXX\./))

if (Object.keys(IPS).length !== 0 && typeof IPS.value !== "object") {
  IPS = ref([])
  window.localStorage.setItem("IPS", JSON.stringify(IPS))
}

function newIP() {
  if (newip.value.length > 0 && newip.value.match(IPregex)) {
    Object(IPS.value).push(newip.value)
    newip.value = ""
    savelocalstorage()
    searchIP()
  }
}
let savelocalstorage: Function
let searchIP: Function
function init(Fsavelocalstorage: Function, FsearchIP: Function) {
  savelocalstorage = Fsavelocalstorage
  searchIP = FsearchIP
}

export { init, connected, connectedStyle, newip, newIP, IPS, ips, newIPPrompt }
