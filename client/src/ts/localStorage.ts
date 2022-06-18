let token: string = window.localStorage.getItem("token") || ""

let preset: { windows: string[], linux: string[] }
try {
  preset = JSON.parse(window.localStorage.getItem("preset") || '{"windows": [], "linux": []}')
  if (Object.keys(preset).length !== 2 && typeof preset.windows !== "object" && typeof preset.linux !== "object") {
    throw new Error("Invalid preset")
  }
} catch (e) {
  preset = { "windows": [], "linux": [] }
  window.localStorage.setItem("preset", JSON.stringify(preset))
}


let IPS: string[]
try {
  IPS = JSON.parse(window.localStorage.getItem("IPS") || "[]")
  if (Object.keys(IPS).length !== 0 && typeof IPS !== "object") {
    throw new Error("Invalid IPS")
  }
} catch (e) {
  IPS = []
  window.localStorage.setItem("IPS", JSON.stringify(IPS))
}

type configProp = "token" | "IPS" | "preset"
// interface config { [index: string]: string | string[] | preset }

const localStorage = new Proxy({ token, preset, IPS }, {
  get(obj, prop: configProp) { return obj[prop] },
  set(obj, prop: configProp, value) {
    console.log("in set", prop, value)
    obj[prop] = value
    if (prop === "token") {
      window.localStorage.setItem(prop, value)
    } else {
      window.localStorage.setItem(prop, JSON.stringify(value))
    }
    return true
  }
})

export default localStorage
