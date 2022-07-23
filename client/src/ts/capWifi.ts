import { Wifi } from '@capacitor-community/wifi';

export default async function getNativeIps(ips: string[]): Promise<string[]> {
  const newNativeIPs: string[] = []
  const ipdata = await Wifi.getAllIP()
  const nativeIPs = Object.values(ipdata)
  const nativeIPsHost = nativeIPs.map((ip: string) => {
    return ip.split('.')[2]
  })
  for (const value of ips) {
    if (value.match(/\.XXX\./)) {
      nativeIPsHost.forEach((nativeIP: string) => {
        newNativeIPs.push(value.replace(/\.XXX\./, `.${nativeIP}.`))
      })
    }
  }
  return newNativeIPs
}
