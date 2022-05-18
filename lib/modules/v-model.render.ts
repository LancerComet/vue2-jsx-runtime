import { isArray, isUndefined } from '../utils'
import { getCurrentInstance } from '@vue/composition-api'
import { VNodeChildren, VNodeData } from 'vue'

/**
 * Deal with v-model directive.
 * For now only support composition API + Ref.
 *
 * @param key
 * @param config
 * @param vNodeData
 */
const dealWithVModelRender = (key: string, config: {
  children?: VNodeChildren
  [props: string]: any
}, vNodeData: VNodeData) => {
  const instance = getCurrentInstance()
  const vueComp = instance.proxy

  const vModelBindingKey = config[key] as string
  const inputType = config.type

  // File.
  const isFileInput = inputType === 'file'
  if (isFileInput) {
    // TODO: ...
    return
  }

  // Radio.
  const isRadioInput = inputType === 'radio'
  if (isRadioInput) {
    vNodeData.domProps.checked = vueComp[vModelBindingKey] === config.value
    vNodeData.on.change = (event: Event) => {
      const target = event.target as HTMLInputElement
      vueComp[vModelBindingKey] = target.value
    }
    return
  }

  // Checkbox.
  const isCheckboxInput = inputType === 'checkbox'
  if (isCheckboxInput) {
    // Array binding.
    if (isArray(vueComp[vModelBindingKey])) {
      vNodeData.domProps.checked = vueComp[vModelBindingKey].includes(config.value)
      vNodeData.on.change = () => {
        const index = vueComp[vModelBindingKey].indexOf(config.value)
        if (index > -1) {
          vueComp[vModelBindingKey].splice(index, 1)
        } else {
          vueComp[vModelBindingKey].push(config.value)
        }
      }

    // Basic value.
    } else {
      const checkboxDefaultValue = 'on' // Default value for checkbox is 'on'.
      vNodeData.domProps.checked = vueComp[vModelBindingKey] === (config.value || checkboxDefaultValue)
      vNodeData.on.change = (event: Event) => {
        const target = event.target as HTMLInputElement
        const isValueSpecified = !isUndefined(config.value)
        if (isValueSpecified) {
          vueComp[vModelBindingKey] = target.value
        } else {
          const newCheckStatus = !target.checked
          vueComp[vModelBindingKey] = newCheckStatus ? checkboxDefaultValue : undefined
        }
      }
    }
    return
  }

  // Others are treated as text fields.
  vNodeData.attrs['data-ime-start'] = false
  vNodeData.domProps.value = vueComp[vModelBindingKey]
  vNodeData.on.input = (event: Event) => {
    if (vNodeData.attrs['data-ime-start']) {
      return
    }
    const target = event.target as HTMLInputElement
    vueComp[vModelBindingKey] = target.value
  }

  vNodeData.on.compositionstart = config.compositionstart || function () {
    vNodeData.attrs['data-ime-start'] = true
  }

  vNodeData.on.compositionend = config.compositionend || function (event: Event) {
    vNodeData.attrs['data-ime-start'] = false
    const target = event.target as HTMLInputElement
    vueComp[vModelBindingKey] = target.value
  }
}

export {
  dealWithVModelRender
}
