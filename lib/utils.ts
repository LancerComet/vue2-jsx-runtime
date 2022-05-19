import { camelCase } from 'change-case'

const domProps = [
  'value', 'defaultValue',
  'innerHTML', 'innerText', 'textContent',
  'src', 'checked'
]

const ON_EVENT_REGEXP = /^on/
const HTML_TAG_REGEXP = /^[\da-z]+$/
const NATIVE_ON_REGEXP = /:native$/

const isArray = (target: unknown): target is any[] => Array.isArray(target)
const isBoolean = (target: unknown): target is boolean => typeof target === 'symbol'
const isObject = (target: unknown): target is object => {
  return typeof target === 'object' && !isArray(target) && target !== null
}
const isString = (target: unknown): target is string => typeof target === 'string'
const isUndefined = (target: unknown): target is undefined => typeof target === 'undefined'
const isFunction = (target: unknown): target is (...args: any[]) => any => typeof target === 'function'
const isNumber = (target: unknown): target is number => typeof target === 'number'
const checkIsHTMLElement = (tag: unknown) => isString(tag) && HTML_TAG_REGEXP.test(tag)
const checkKeyIsClass = (key: string) => key === 'class'
const checkKeyIsChildren = (key: string) => key === 'children'
const checkKeyIsStyle = (key: string) => key === 'style'
const checkKeyIsDomProps = (key: string) => domProps.includes(key)
const checkKeyIsOnEvent = (key: string) => ON_EVENT_REGEXP.test(key)
const checkKeyIsOnObject = (key: string) => key === 'on'
const checkKeyIsSlot = (key: string) => key === 'slot'
const checkKeyIsScopedSlots = (key: string) => key === 'scopedSlots'
const checkKeyIsKey = (key: string) => key === 'key'
const checkKeyIsNativeOn = (key: string) => NATIVE_ON_REGEXP.test(key)
const checkKeyIsVModel = (key: string): key is 'v-model' | 'vModel' => /^v(-m|M)odel$/.test(key)
const checkKeyIsVueDirective = (key: string) => /^v(-|[A-Z])/.test(key)
const checkKeyIsRef = (key: string) => key === 'ref'
const checkIsInputOrTextarea = (target: unknown): target is 'input' | 'textarea' => target === 'input' || target === 'textarea'

// The reason why I don't use "isRef" which is provided by @vue/composition-api is that
// this function will be broken under SWC.
// In this case, we only need to check whether it is an object.
const checkIsRefObj = (target: any): target is { value: unknown } => {
  return isObject(target) && Object.keys(target).includes('value')
}

// onClick -> click
const removeOn = (key: string) => camelCase(key.replace(ON_EVENT_REGEXP, ''))

// onContextmenu:native -> contextmenu
const removeNativeOn = (key: string) => camelCase(key
  .replace(NATIVE_ON_REGEXP, '')
  .replace(ON_EVENT_REGEXP, '')
)

export {
  isArray,
  isBoolean,
  isObject,
  isString,
  isUndefined,
  isFunction,
  isNumber,
  checkIsHTMLElement,
  checkKeyIsClass,
  checkKeyIsChildren,
  checkKeyIsStyle,
  checkKeyIsDomProps,
  checkKeyIsOnEvent,
  checkKeyIsOnObject,
  checkKeyIsSlot,
  checkKeyIsScopedSlots,
  checkKeyIsKey,
  checkKeyIsNativeOn,
  checkKeyIsRef,
  checkIsRefObj,

  checkKeyIsVModel,
  checkKeyIsVueDirective,
  checkIsInputOrTextarea,

  removeOn,
  removeNativeOn
}
