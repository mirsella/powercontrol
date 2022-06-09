import { Wifi } from '@capacitor-community/wifi';
import { Ref } from 'vue'

let searchIP: Function
let IPS: Ref

function getNativeIps() {
  Wifi.getAllIP()
  .then((e: object) => {
    const nativeIPs = Object.values(e)
    const nativeIPsHost = nativeIPs.map((ip: string) => {
      return ip.split('.')[2]
    })
    const ips = Array.from(IPS.value)
    // for (const [index, ip] of ips.entries()) {
    ips.forEach((value: any, index: number) => {
      if (value.match(/\.XXX\./)) {
        ips.splice(index, 1)
        nativeIPsHost.forEach((nativeIP: string) => {
          ips.push(value.replace(/\.XXX\./, `.${nativeIP}.`))
        })
      }
    })
    searchIP()
  })
}


function init(IsearchIP: Function, IIPS: Ref) {
  searchIP = IsearchIP
  IPS = IIPS
}
export { init, getNativeIps }
