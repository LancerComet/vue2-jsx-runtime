import { h } from '@vue/composition-api'
import { VNode, VNodeChildren, VNodeData } from 'vue'
import { AsyncComponent, Component } from 'vue/types/options'
import camelCase from 'camelcase'

const domProps = [
  'value', 'innerHTML', 'innerText', 'textContent'
]

const ON_EVENT_REGEXP = /^on/
const HTML_TAG_REGEXP = /^[\da-z]+$/

const isArray = (target: unknown): target is any[] => Array.isArray(target)
// const isObject = (target: unknown): target is object => typeof target === 'object'
const isString = (target: unknown): target is string => typeof target === 'string'
const isUndefined = (target: unknown): target is undefined => typeof target === 'undefined'
// const isFunction = (target: unknown): target is (...args: any[]) => any => typeof target === 'function'
const checkIsHTMLElement = (tag: unknown) => isString(tag) && HTML_TAG_REGEXP.test(tag)
const checkKeyIsClass = (key: string) => key === 'class'
const checkKeyIsChildren = (key: string) => key === 'children'
const checkKeyIsStyle = (key: string) => key === 'style'
const checkKeyIsDomProps = (key: string) => domProps.includes(key)
const checkKeyIsOnEvent = (key: string) => ON_EVENT_REGEXP.test(key)
const checkKeyIsOnObject = (key: string) => key === 'on'
const checkKeyIsSlot = (key: string) => key === 'slot'
const checkIsScopedSlots = (key: string) => key === 'scopedSlots'

const jsx = (
  tag: string | Component<any, any, any, any> | AsyncComponent<any, any, any, any> | (() => Component),
  config: {
    children?: VNodeChildren
    [props: string]: any
  } = {}
): VNode => {
  // Reference:
  // https://cn.vuejs.org/v2/guide/render-function.html

  // I treat every lowercase string as HTML element.
  // Because in JSX Vue component should be (Upper) CamelCase named.
  const isHTMLElement = checkIsHTMLElement(tag)

  // Deal with vNodeData.
  const vNodeData: VNodeData = {
    attrs: {},
    props: {},
    domProps: {},
    on: {}
  }

  const attrKeys = Object.keys(config)
  for (const key of attrKeys) {
    // Children shouldn't be set in vNodeData.
    if (checkKeyIsChildren(key)) {
      continue
    }

    const value = config[key]

    // Deal with class and style.
    // Everything now is thrown to reactive class/style because I can't tell the difference
    // between static class/style and reactive class/style.
    if (checkKeyIsClass(key)) {
      vNodeData.class = value
      continue
    }

    if (checkKeyIsStyle(key)) {
      vNodeData.style = value
      continue
    }

    if (checkKeyIsDomProps(key)) {
      vNodeData.domProps[key] = value
      continue
    }

    if (checkKeyIsOnObject(key)) {
      vNodeData.on = value
      continue
    }

    if (checkKeyIsOnEvent(key)) {
      const keyWithoutOn = camelCase(key.replace(ON_EVENT_REGEXP, ''))
      vNodeData.on[keyWithoutOn] = value
      continue
    }

    if (checkKeyIsSlot(key)) {
      vNodeData.slot = value
      continue
    }

    if (checkIsScopedSlots(key)) {
      vNodeData.scopedSlots = value
      continue
    }

    if (isHTMLElement) {
      vNodeData.attrs[key] = value
    } else {
      vNodeData.props[key] = value
    }
  }

  // Check is JSXS function.
  const isJsxsFunc = typeof tag === 'function' && isUndefined((tag as any).cid)

  // @ts-ignore
  return h(
    isJsxsFunc
      ? { setup: () => tag } // JSXS function should wrap into setup function.
      : tag,
    vNodeData,
    // Seems like it's a bug right here, it must be an array, but it claimed that it shouldn't have to.
    isArray(config.children) ? config.children : [config.children]
  )
}

export {
  jsx
}
