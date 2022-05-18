import { isArray, isUndefined } from '../utils'
import { Ref } from '@vue/composition-api'
import { VNodeChildren, VNodeData } from 'vue'

/**
 * Deal with v-model directive.
 * For now only support composition API + Ref.
 *
 * @param key
 * @param config
 * @param vNodeData
 */
const dealWithVModelComposition = (key: string, config: {
  children?: VNodeChildren
  [props: string]: any
}, vNodeData: VNodeData) => {
  const vModelBinding = config[key] as Ref<unknown>
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
    vNodeData.domProps.checked = vModelBinding.value === config.value
    vNodeData.on.change = (event: Event) => {
      const target = event.target as HTMLInputElement
      vModelBinding.value = target.value
    }
    return
  }

  // Checkbox.
  const isCheckboxInput = inputType === 'checkbox'
  if (isCheckboxInput) {
    // Array binding.
    if (isArray(vModelBinding.value)) {
      vNodeData.domProps.checked = vModelBinding.value.includes(config.value)
      vNodeData.on.change = () => {
        const _binding = vModelBinding as Ref<unknown[]>
        const index = _binding.value.indexOf(config.value)
        if (index > -1) {
          _binding.value.splice(index, 1)
        } else {
          _binding.value.push(config.value)
        }
      }

    // Basic value.
    } else {
      const checkboxDefaultValue = 'on' // Default value for checkbox is 'on'.
      vNodeData.domProps.checked = vModelBinding.value === (config.value || checkboxDefaultValue)
      vNodeData.on.change = (event: Event) => {
        const target = event.target as HTMLInputElement
        const isValueSpecified = !isUndefined(config.value)
        if (isValueSpecified) {
          vModelBinding.value = target.value
        } else {
          const newCheckStatus = !target.checked
          vModelBinding.value = newCheckStatus ? checkboxDefaultValue : undefined
        }
      }
    }
    return
  }

  // Others are treated as text fields.

  vNodeData.attrs['data-ime-start'] = false
  vNodeData.domProps.value = vModelBinding.value
  vNodeData.on.input = (event: Event) => {
    if (vNodeData.attrs['data-ime-start']) {
      return
    }
    const target = event.target as HTMLInputElement
    vModelBinding.value = target.value
  }

  vNodeData.on.compositionstart = config.compositionstart || function () {
    vNodeData.attrs['data-ime-start'] = true
  }

  vNodeData.on.compositionend = config.compositionend || function (event: Event) {
    vNodeData.attrs['data-ime-start'] = false
    const target = event.target as HTMLInputElement
    vModelBinding.value = target.value
  }
}

export {
  dealWithVModelComposition
}
