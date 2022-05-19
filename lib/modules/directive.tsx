import { VNodeChildren, VNodeData, VNodeDirective } from 'vue'
import { getCurrentInstance, isRef, Ref } from '@vue/composition-api'
import { paramCase } from 'change-case'
import { isString } from '../utils'

// v-xxx-xxx:a.b.c => {
//   name: 'xxx-xxx',
//   argument: 'a',
//   modifiers: { a: true, b: true, c: true }
// }
const getDirectiveInfo = (key: string) => {
  key = key.replace(/^v-?/, '') // xxx-xxx, xxxXxx:a.b.c
  const [name, args] = key.split(':') // ['xxx-xxx', 'a.b.c']

  // ['a', ['b', 'c']]
  const [argument, ...modifierList] = isString(args) ? args.split('.') : []

  let modifiers: Record<string, true>
  if (modifierList.length) {
    modifiers = {}
    modifierList.forEach(key => {
      modifiers[key] = true
    })
  }

  return {
    name: paramCase(name),
    argument,
    modifiers
  } as {
    name: string
    argument: string | undefined
    modifiers: Record<string, true> | undefined
  }
}

const getDirValue = (directiveRawValue: string | Ref<string>) => {
  if (isRef(directiveRawValue)) {
    return directiveRawValue.value
  }

  const isVariableName = /^[a-zA-Z_$]([\d\w$]+)?$/.test(directiveRawValue)
  if (isVariableName) {
    const instance = getCurrentInstance()
    const vm = instance.proxy
    return vm[directiveRawValue]
  }

  const floatValue = parseFloat(directiveRawValue)
  if (!isNaN(floatValue)) {
    return floatValue
  }

  // Array, function, object, ect.
  return directiveRawValue
}

const dealWithDirective = (
  key: string, // v-xxx-xxx, vXxxXxx:a.b.c
  vNodeData: VNodeData,
  config: {
    children?: VNodeChildren
    [props: string]: any
  } = {}
) => {
  vNodeData.directives = vNodeData.directives || []

  const directiveInfo = getDirectiveInfo(key)
  const directiveRawValue = config[key] as string | Ref<string>

  const directive: VNodeDirective = {
    name: directiveInfo.name,
    value: getDirValue(directiveRawValue),
    expression: isString(directiveRawValue) ? directiveRawValue : undefined,
    arg: directiveInfo.argument,
    modifiers: directiveInfo.modifiers
  }

  vNodeData.directives.push(directive)
}

export {
  dealWithDirective,
  getDirectiveInfo
}
