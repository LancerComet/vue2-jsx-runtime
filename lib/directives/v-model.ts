import { checkIsRefObj, getValueFromObject, isArray, isString, isUndefined, setValueToObject } from '../utils'
import type { Ref } from '@vue/composition-api'
import type { VNodeData } from 'vue'
import { ConfigType, TagType } from '../type'
import { getCurrentInstance } from '../runtime'

const IME_START_KEY = '__ime_start__'

type vModelBinding =
  string | Ref<unknown> |
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
  let bindingKeyPathOrRef: string | Ref<unknown>
  let argument: string | undefined
  let modifiers: string[] = []

  if (isString(bindingExpression) || checkIsRefObj(bindingExpression)) {
    bindingKeyPathOrRef = bindingExpression
  } else if (isArray(bindingExpression)) {
    bindingKeyPathOrRef = bindingExpression[0]
    if (bindingExpression.length === 2) {
      if (isArray(bindingExpression[1])) {
        modifiers = bindingExpression[1]
      } else if (isString(bindingExpression[1])) {
        argument = bindingExpression[1]
      }
    } else if (bindingExpression.length === 3) {
      argument = bindingExpression[1]
      modifiers = bindingExpression[2]
    }
  }

  const instance = getCurrentInstance()
  const getBindingValue = () => {
    // v-model='a.b.c'
    if (isString(bindingKeyPathOrRef)) {
      return getValueFromObject(instance, bindingKeyPathOrRef)
    }

    // v-model={[xxRef, 'a.b.c']}
    if (argument) {
      return getValueFromObject(bindingKeyPathOrRef.value, argument)
    }

    // v-model={xxRef}
    return bindingKeyPathOrRef.value
  }

  const emitValue = (payload: unknown) => {
    if (isString(bindingKeyPathOrRef)) {
      setValueToObject(instance, bindingKeyPathOrRef, payload)
      // Vue.set(instance, bindingKeyPathOrRef, payload)
    } else if (argument) {
      setValueToObject(bindingKeyPathOrRef.value, argument, payload)
      // Vue.set(bindingKeyPathOrRef.value as any, argument, payload)
    } else {
      bindingKeyPathOrRef.value = payload
    }
  }

  // <select />.
  if (tag === 'select') {
    vNodeData.domProps.value = getBindingValue()
    vNodeData.on.change = (event: Event) => {
      const target = event.target as HTMLSelectElement
      const payload = target.value
      emitValue(payload)
    }
    return
  }

  // <input radio|checkbox />.
  if (tag === 'input') {
    const inputType = config.type // 'file', 'text', 'number', .ect.

    // Skip unsupported input.
    const isSkippedType = /button|file|submit|reset/.test(inputType)
    if (isSkippedType) {
      return
    }

    // Radio.
    const isRadioInput = inputType === 'radio'
    if (isRadioInput) {
      vNodeData.domProps.checked = getBindingValue() === config.value
      vNodeData.on.change = (event: Event) => {
        const target = event.target as HTMLInputElement
        const payload = target.value
        emitValue(payload)
      }
      return
    }

    // Checkbox.
    const isCheckboxInput = inputType === 'checkbox'
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
          const payload = isValueSpecified
            ? target.value
            : newCheckStatus ? checkboxDefaultValue : undefined
          emitValue(payload)
        }
      }

      const bindingValue: unknown = getBindingValue()

      if (isArray(bindingValue)) {
        arrayBindingExec(bindingValue)
      } else {
        basicBindingExec(bindingValue)
      }
      return
    }
  }

  // <input /> | <textarea />.
  if (tag === 'input' || tag === 'textarea') {
    const isDirectInput = modifiers.includes('direct')
    const isLazyInput = modifiers.includes('lazy')
    const emit = (value: string) => {
      const hasNumberModifier = modifiers.includes('number')
      const hasTrimModifier = modifiers.includes('trim')
      const payload = hasNumberModifier
        ? parseFloat(value)
        : hasTrimModifier
          ? value.trim()
          : value

      emitValue(payload)
    }

    vNodeData.attrs[IME_START_KEY] = false
    vNodeData.domProps.value = getBindingValue()
    vNodeData.on.input = (event: Event) => {
      if (isLazyInput || (!isDirectInput && vNodeData.attrs[IME_START_KEY])) {
        return
      }

      const target = event.target as HTMLInputElement
      emit(target.value)
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
    vNodeData.props.value = getBindingValue()
    vNodeData.on.input = (payload) => {
      emitValue(payload)
    }
  }
}

export {
  dealWithVModel
}
