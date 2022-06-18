import { ref, Ref, computed } from 'vue'
import localStorage from './localStorage'
import getNativeIps from './capWifi'
import { searchIP } from './utils'

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

function newIP(nextboot: Ref) {
  if (newip.value.length > 0 && newip.value.match(IPregex)) {
    localStorage.IPS = [...localStorage.IPS, newip.value]
    // localStorage.IPS.push(newip.value)
    newip.value = ""
    searchIP(nextboot, () => {})
  }
}

async function getAllIPs() {
  const ips = Array.from(localStorage.IPS.filter(ip => ! ip.match(/\.XXX\./)))
  const nativeIPs = await getNativeIps(localStorage.IPS)
  nativeIPs.forEach(ip => ips.push(ip))
  return ips
}

export { connected, connectedStyle, newip, newIP, newIPPrompt, getAllIPs }
