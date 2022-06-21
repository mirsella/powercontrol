import { connected, getAllIPs } from './ipUtils'
import { Ref } from 'vue'
import { token, preset, savelocalstorage } from './localStorage'
import axios from 'redaxios' 

async function searchIP(nextboot: Ref, error: Ref) {
  document.querySelector('#refresh')?.classList.add('animate-spin')
  const httpRequests: Promise<void>[] = [];

  const ips = await getAllIPs()
  ips.forEach((ip: string) => {
    const lip = ip
    // if (lip.match(/\.XXX\./)) { return }

    httpRequests.push(
      axios.get(`${lip}/`, {headers: { Authorization: `Bearer ${token.value}` }})
      .then(res => {
        if (res.status === 200 && res.data === "powercontrol") {
          connected.value = lip
          error.value = ""
          getnextboot(nextboot, error)
        }  
      })
    )
  })
  httpRequests.push(new Promise(resolve => setTimeout(resolve, 10000)))
  await Promise.all([
    Promise.any(httpRequests),
    new Promise(resolve => setTimeout(resolve, 1000))
  ])
  .then(() => {
    document.querySelector('#refresh')?.classList.remove('animate-spin')
  })
}

function setnextboot(presetName: "windows" | "linux", nextboot: Ref, error: Ref) {
  const nextpreset = preset.value[presetName]
  axios.post(`${connected.value}/setnextboot`, nextpreset, 
             {headers: { Authorization: `Bearer ${token.value}` }})
             .then(res => {
               if (res.status === 200 && JSON.stringify(res.data) === JSON.stringify(nextpreset)) {
                 nextboot.value = presetName
                 savelocalstorage()
                 error.value = ""
               } else { error.value = JSON.stringify({status: res.status, data: res.data}) }
             })
             .catch(err => {
               return error.value = err.data
             })
}

function getnextboot(nextboot: Ref, error: Ref) {
  axios.get(`${connected.value}/getnextboot`,
            {headers: { Authorization: `Bearer ${token.value}` }})
            .then(res => {
              if (res.status === 200) {
                error.value = ""
                if (JSON.stringify(res.data) == JSON.stringify(preset.value.linux)) {
                  nextboot.value = "linux"
                } else if (JSON.stringify(res.data) == JSON.stringify(preset.value.windows)) {
                  nextboot.value = "windows"
                } else {
                  nextboot.value = ""
                }
              }  else { error.value = JSON.stringify({status: res.status, data: res.data}) }
            })
            .catch(err => error.value = err.data)
}

function power(action: "power" | "reset" | "reboot", error: Ref) {
  connected.value !== "" &&
    axios.get(`${connected.value}/${action}`,
              {headers: { Authorization: `Bearer ${token.value}` }})
              .then(res => {
                if (res.status === 200 && res.data === action) {
                  error.value = ""
                  const el = document.querySelector(`#${action}`)
                  el!.className += " duration-1000 shadow-full shadow-green-500"
                  setTimeout(() => {
                    el!.className = el!.className.replace(" duration-1000 shadow-full shadow-green-500", "")
                  }, 1000)
                } else { error.value = JSON.stringify({status: res.status, data: res.data}) }
              })
              .catch(err => error.value = err.data)
}

export { setnextboot, getnextboot, power, searchIP }
