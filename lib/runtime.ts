import type { VueConstructor } from 'vue'

let currentInstance: InstanceType<VueConstructor>

const getCurrentInstance = () => {
  return currentInstance
}

const setCurrentInstance = (instance: InstanceType<VueConstructor>) => {
  currentInstance = instance
}

export {
  getCurrentInstance,
  setCurrentInstance
}
