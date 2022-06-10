import { Wifi } from '@capacitor-community/wifi';

export default async function getNativeIps(ips: string[]): Promise<string[]> {
  const newNativeIPs: string[] = []
  const ipdata = await Wifi.getAllIP()
  const nativeIPs = Object.values(ipdata)
  const nativeIPsHost = nativeIPs.map((ip: string) => {
    return ip.split('.')[2]
  })

  for (const [ index, value ] of ips.entries()) {
    if (value.match(/\.XXX\./)) {
      ips.splice(index, 1)
      nativeIPsHost.forEach((nativeIP: string) => {
        newNativeIPs.push(value.replace(/\.XXX\./, `.${nativeIP}.`))
      })
    }
  }
  return newNativeIPs
}
