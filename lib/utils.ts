import { camelCase } from 'change-case'

// https://github.com/vuejs/vue/blob/0603ff695d2f41286239298210113cbe2b209e28/src/platforms/web/server/util.js#L5
const domPropsList = 'accept,accesskey,action,align,alt,async,autocomplete,' +
  'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
  'checked,cite,code,codebase,color,cols,colspan,content,' +
  'contenteditable,contextmenu,controls,coords,data,datetime,default,' +
  'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,for,' +
  'form,formaction,headers,height,hidden,high,href,hreflang,' +
  'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
  'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
  'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
  'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
  'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
  'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
  'target,title,usemap,value,width,wrap,' +
  'className,classList,innerHTML,innerText,outerHTML,outerText,textContent'.split(',')

const ON_EVENT_REGEXP = /^((v(-o|O)n:)|on)/
const HTML_TAG_REGEXP = /^[\da-z]+$/
const NATIVE_ON_REGEXP = /:native$/
const KEY_REGEXP = /^v(-b|B)ind:key$/
const VUE_DIRECTIVE_REGEXP = /^v(-|[A-Z])/

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
const checkKeyIsDomProp = (key: string) => domPropsList.includes(key)
const checkKeyIsOnEvent = (key: string) => ON_EVENT_REGEXP.test(key)
const checkKeyIsOnObject = (key: string) => key === 'on'
const checkKeyIsSlot = (key: string) => key === 'slot'
const checkKeyIsScopedSlots = (key: string) => key === 'scopedSlots'
const checkKeyIsKey = (key: string) => KEY_REGEXP.test(key)
const checkKeyIsNativeOn = (key: string) => NATIVE_ON_REGEXP.test(key)
const checkKeyIsVueDirective = (key: string) => VUE_DIRECTIVE_REGEXP.test(key)
const checkKeyIsRef = (key: string) => key === 'ref'
const checkKeyIsRefInFor = (key: string) => key === 'refInFor'
const checkKeyIsAttrs = (key: string) => key === 'attrs'

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

const getValueFromObject = (target: any, keyPath: string): any => {
  const keys = keyPath.split('.')
  let value: any
  for (let i = 0, length = keys.length; i < length; i++) {
    const key = keys[i]
    if (i === 0) {
      value = target[key]
      continue
    }

    if (typeof value !== 'undefined') {
      const currentValue = value[key]
      value = currentValue
    }
  }
  return value
}

const setValueToObject = (target: any, keyPath: string, payload: any) => {
  const keys = keyPath.split('.')
  let lastTarget: any = target
  for (let i = 0, length = keys.length; i < length; i++) {
    const key = keys[i]

    if (i === length - 1) {
      lastTarget[key] = payload
      return
    }

    lastTarget = lastTarget[key]
  }
}

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
  checkKeyIsDomProp,
  checkKeyIsOnEvent,
  checkKeyIsOnObject,
  checkKeyIsSlot,
  checkKeyIsScopedSlots,
  checkKeyIsKey,
  checkKeyIsNativeOn,
  checkKeyIsRef,
  checkIsRefObj,
  checkKeyIsRefInFor,
  checkKeyIsAttrs,

  checkKeyIsVueDirective,

  removeOn,
  removeNativeOn,

  getValueFromObject,
  setValueToObject
}
