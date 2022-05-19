import type { VNode, VNodeData } from 'vue'
import {
  checkKeyIsVueDirective,
  checkIsHTMLElement,
  checkKeyIsNativeOn,
  checkKeyIsChildren,
  checkKeyIsClass,
  checkKeyIsDomProps,
  checkKeyIsKey,
  checkKeyIsOnEvent,
  checkKeyIsOnObject,
  checkKeyIsScopedSlots,
  checkKeyIsSlot,
  checkKeyIsStyle,
  checkKeyIsVModel,
  isArray,
  isUndefined,
  removeNativeOn,
  removeOn, checkKeyIsRef
} from './utils'
import { Fragment } from './modules/fragment'
import { dealWithVModel } from './modules/v-model'
import { dealWithDirective } from './modules/directive'
import { ConfigType, TagType } from './type'
import { getCurrentInstance } from './runtime'

// Reference:
// https://cn.vuejs.org/v2/guide/render-function.html
const jsx = function (
  tag: TagType,
  config: ConfigType = {}
): VNode {
  const h = getCurrentInstance().$createElement

  // Deal with vNodeData.
  const vNodeData: VNodeData = {
    attrs: {},
    props: {},
    domProps: {},
    on: {}
  }

  const isFragment = isUndefined(tag) && config.children
  if (isFragment) {
    return h(
      Fragment,
      vNodeData,
      isArray(config.children) ? config.children : [config.children]
    )
  }

  // I treat every lowercase string as HTML element.
  // Because in JSX Vue component should be (Upper) CamelCase named.
  const isHTMLElement = checkIsHTMLElement(tag)

  const attrKeys = Object.keys(config)
  for (const key of attrKeys) {
    // Children shouldn't be set in vNodeData.
    if (checkKeyIsChildren(key)) {
      continue
    }

    const value = config[key]

    if (checkKeyIsKey(key)) {
      vNodeData.key = value
      continue
    }

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

    if (checkKeyIsNativeOn(key) && !isHTMLElement) {
      const _key = removeNativeOn(key)
      vNodeData.nativeOn = vNodeData.nativeOn || {}
      vNodeData.nativeOn[_key] = value
      continue
    }

    if (checkKeyIsOnEvent(key)) {
      const _key = removeOn(key)
      vNodeData.on[_key] = value
      continue
    }

    if (checkKeyIsSlot(key)) {
      vNodeData.slot = value
      continue
    }

    if (checkKeyIsScopedSlots(key)) {
      vNodeData.scopedSlots = value
      continue
    }

    // v-model, vModel.
    if (checkKeyIsVModel(key)) {
      dealWithVModel(tag, key, config, vNodeData, isHTMLElement)
      continue
    }

    if (checkKeyIsRef(key)) {
      vNodeData.ref = value
      continue
    }

    // v-dir, vDir
    if (checkKeyIsVueDirective(key)) {
      dealWithDirective(key, vNodeData, config)
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

  return h(
    // JSXS function should be wrapped.
    // @ts-ignore
    isJsxsFunc ? { render: tag } : tag,
    vNodeData,
    isArray(config.children) ? config.children : [config.children]
  )
}

export {
  jsx
}
