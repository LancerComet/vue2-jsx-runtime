import Vue from 'vue'
import { jsx } from './jsx'
import { setCurrentInstance } from './runtime'

Vue.mixin({
  beforeCreate () {
    setCurrentInstance(this)
  },
  beforeUpdate () {
    setCurrentInstance(this)
  },
  beforeMount () {
    setCurrentInstance(this)
  }
})

export {
  jsx,
  jsx as jsxs,
  jsx as jsxDEV
}
