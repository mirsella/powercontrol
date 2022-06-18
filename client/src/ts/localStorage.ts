let token: string = window.localStorage.getItem("token") || ""

interface preset { windows: string[], linux: string[] }
let preset: preset = JSON.parse(window.localStorage.getItem("preset") || '{"windows": [], "linux": []}')

if (Object.keys(preset).length !== 2 && typeof preset.windows !== "object" && typeof preset.linux !== "object") {
  preset = { "windows": [], "linux": [] }
  window.localStorage.setItem("preset", JSON.stringify(preset))
}

let IPS: string[] = JSON.parse(window.localStorage.getItem("IPS") || "[]")
if (Object.keys(IPS).length !== 0 && typeof IPS !== "object") {
  IPS = []
  window.localStorage.setItem("IPS", JSON.stringify(IPS))
}

type configProp = "token" | "IPS" | "preset"
// interface config { [index: string]: string | string[] | preset }

const localStorage = new Proxy({ token: token, preset: preset, IPS: IPS }, {
  get(obj, prop: configProp) { return obj[prop] },
  set(obj, prop: configProp, value) {
    obj[prop] = value
    window.localStorage.setItem(prop, value)
    return true
  }
})

export default localStorage
