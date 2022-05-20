import type { VNodeChildren, VNodeData, VNodeDirective } from 'vue'
import type { Ref } from '@vue/composition-api'
import { paramCase } from 'change-case'
import { checkIsRefObj, isBoolean, isNumber, isString } from '../utils'
import { getCurrentInstance } from '../runtime'
import { dealWithVModel } from './v-model'
import { TagType } from '../type'
import { dealWithVText } from './v-text'
import { dealWithVHTML } from './v-html'

const checkIsVModel = (key: string): key is 'v-model' | 'vModel' => /^v(-m|M)odel$/.test(key)
const checkIsVText = (key: string): key is 'v-text' | 'vText' => /^v(-t|T)ext$/.test(key)
const checkIsVHTML = (key: string): key is 'v-html' | 'vHtml' => /^v(-h|H)tml$/.test(key)

/**
 * v-show:a.b.c => {
 *   name: 'show',
 *   argument: 'a',
 *   modifiers: { a: true, b: true, c: true }
*  }
 *
 * @param key
 */
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

const dealWithDirective = (
  tag: TagType,
  key: string, // v-xxx-xxx, vXxxXxx:a.b.c
  vNodeData: VNodeData,
  config: {
    children?: VNodeChildren
    [props: string]: any
  } = {},
  isHTMLElement: boolean
) => {
  vNodeData.directives = vNodeData.directives || []

  // v-model.
  if (checkIsVModel(key)) {
    dealWithVModel(tag, config[key], config, vNodeData, isHTMLElement)
    return
  }

  // v-text.
  if (checkIsVText(key)) {
    dealWithVText(vNodeData, config[key])
    return
  }

  // v-html.
  if (checkIsVHTML(key)) {
    dealWithVHTML(vNodeData, config[key])
    return
  }

  const directiveInfo = getDirectiveInfo(key)
  const directiveRawValue = config[key] as string | Ref<string>

  const directive: VNodeDirective = {
    name: directiveInfo.name,
    value: directiveRawValue,
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
