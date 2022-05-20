import { checkIsInputOrTextarea, checkIsRefObj, isArray, isString, isUndefined } from '../utils'
import type { Ref } from '@vue/composition-api'
import type { VNodeData } from 'vue'
import { ConfigType, TagType } from '../type'
import { getCurrentInstance } from '../runtime'

const IME_START_KEY = '__ime_start__'

type vModelBinding = string |
  Ref<unknown> |
  [string | Ref<unknown>] |
  [string | Ref<unknown>, string[]] |
  [string | Ref<unknown>, string, string[]]

const dealWithVModel = (
  tag: TagType,
  bindingExpression: vModelBinding,
  config: ConfigType,
  vNodeData: VNodeData,
  isHTMLElement: boolean
) => {
  let bindingTarget: string | Ref<unknown>
  // let argument: string | undefined
  let modifiers: string[] = []

  if (isString(bindingExpression) || checkIsRefObj(bindingExpression)) {
    bindingTarget = bindingExpression
  } else if (isArray(bindingExpression)) {
    bindingTarget = bindingExpression[0]
    if (bindingExpression.length === 2) {
      modifiers = bindingExpression[1]
    } else if (bindingExpression.length === 3) {
      // argument = bindingExpression[1]
      modifiers = bindingExpression[2]
    }
  }

  if (checkIsInputOrTextarea(tag)) {
    const isInput = tag === 'input'
    const inputType = config.type // 'file', 'text', 'number', .ect.

    // Skip unsupported input.
    const isSkippedInput = /button|submit|reset/.test(inputType)
    if (isSkippedInput) {
      return
    }

    const instance = getCurrentInstance()

    // File.
    const isFileInput = isInput && inputType === 'file'
    if (isFileInput) {
      // TODO: ...
      return
    }

    // Radio.
    const isRadioInput = isInput && inputType === 'radio'
    if (isRadioInput) {
      vNodeData.domProps.checked = isString(bindingTarget)
        ? instance[bindingTarget] === config.value
        : bindingTarget.value === config.value
      vNodeData.on.change = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (isString(bindingTarget)) {
          instance[bindingTarget] = target.value
        } else {
          bindingTarget.value = target.value
        }
      }
      return
    }

    // Checkbox.
    const isCheckboxInput = isInput && inputType === 'checkbox'
    if (isCheckboxInput) {
      const arrayBindingExec = (bindingArr: unknown[]) => {
        vNodeData.domProps.checked = bindingArr.includes(config.value)
        vNodeData.on.change = () => {
          const index = bindingArr.indexOf(config.value)
          if (index > -1) {
            bindingArr.splice(index, 1)
          } else {
            bindingArr.push(config.value)
          }
        }
      }

      const basicBindingExec = (bindingValue: unknown) => {
        const checkboxDefaultValue = 'on' // Default value for checkbox is 'on'.
        vNodeData.domProps.checked = bindingValue === (config.value || checkboxDefaultValue)
        vNodeData.on.change = (event: Event) => {
          const target = event.target as HTMLInputElement
          const isValueSpecified = !isUndefined(config.value)
          const newCheckStatus = target.checked
          if (isString(bindingTarget)) {
            instance[bindingTarget] = isValueSpecified
              ? target.value
              : newCheckStatus ? checkboxDefaultValue : undefined
          } else {
            bindingTarget.value = isValueSpecified
              ? target.value
              : newCheckStatus ? checkboxDefaultValue : undefined
          }
        }
      }

      let bindingValue: unknown
      if (isString(bindingTarget)) {
        bindingValue = instance[bindingTarget]
      } else {
        bindingValue = bindingTarget.value
      }

      if (isArray(bindingValue)) {
        // Array binding.
        arrayBindingExec(bindingValue)
      } else {
        // Basic binding.
        basicBindingExec(bindingValue)
      }
      return
    }

    // Others are treated as text fields.
    const isDirectInput = modifiers.includes('direct')
    const isLazyInput = modifiers.includes('lazy')
    const emitValue = (value: string) => {
      const hasNumberModifier = modifiers.includes('number')
      const hasTrimModifier = modifiers.includes('trim')
      const newValue = hasNumberModifier
        ? parseFloat(value)
        : hasTrimModifier
          ? value.trim()
          : value

      if (isString(bindingTarget)) {
        instance[bindingTarget] = newValue
      } else {
        bindingTarget.value = newValue
      }
    }

    vNodeData.attrs[IME_START_KEY] = false
    vNodeData.domProps.value = isString(bindingTarget)
      ? instance[bindingTarget]
      : bindingTarget.value
    vNodeData.on.input = (event: Event) => {
      if (
        modifiers.includes('lazy') ||
        (!isDirectInput && vNodeData.attrs[IME_START_KEY])
      ) {
        return
      }

      const target = event.target as HTMLInputElement
      emitValue(target.value)
    }

    if (isLazyInput) {
      vNodeData.on.change = (event: Event) => {
        const target = event.target as HTMLInputElement
        emitValue(target.value)
      }
    }

    if (!isDirectInput) {
      vNodeData.on.compositionstart = config.compositionstart || function () {
        vNodeData.attrs[IME_START_KEY] = true
      }

      vNodeData.on.compositionend = config.compositionend || function (event: Event) {
        vNodeData.attrs[IME_START_KEY] = false
        const target = event.target as HTMLInputElement
        emitValue(target.value)
      }
    }

    return
  }

  // v-model on component.
  if (!isHTMLElement) {
    // TODO: Add component support.
  }
}

export {
  dealWithVModel
}
