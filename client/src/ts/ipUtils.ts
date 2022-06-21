import { ref, computed } from 'vue'
import { IPSComp } from './localStorage'
import { searchIP } from './utils'
import getNativeIps from './capWifi'

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

function newIP() {
  if (newip.value.length > 0 && newip.value.match(IPregex)) {
    // Object(IPSComp.value).push(newip.value)
    IPSComp.value = [...IPSComp.value, newip.value]
    newip.value = ""
    searchIP(ref(""), () => {})
  }
}

async function getAllIPs() {
  const ips = Array.from(Object(IPSComp).filter((ip: string) => ! ip.match(/\.XXX\./)))
  const nativeIPs = await getNativeIps(IPSComp.value)
  nativeIPs.forEach(ip => ips.push(ip))
  return ips
}

export { connected, connectedStyle, newip, newIP, IPSComp, newIPPrompt, getAllIPs }
