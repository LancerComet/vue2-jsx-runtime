import type { VNode, VNodeData } from 'vue'
import {
  checkKeyIsVueDirective,
  checkIsHTMLElement,
  checkKeyIsNativeOn,
  checkKeyIsChildren,
  checkKeyIsClass,
  checkKeyIsHtmlAttr,
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
import { dealWithVModel } from './modules/v-model'
import { dealWithDirective } from './modules/directive'
import { ConfigType, TagType } from './type'
import { getCurrentInstance } from './runtime'

const V_BIND_REGEXP = /^v(-b|B)ind:/

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

  // I treat every lowercase string as HTML element.
  // Because in JSX Vue component should be (Upper) CamelCase named.
  const isHTMLElement = checkIsHTMLElement(tag)

  const attrKeys = Object.keys(config)
  for (let key of attrKeys) {
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

    // on.
    if (checkKeyIsOnObject(key)) {
      vNodeData.on = value
      continue
    }

    // onXX:native
    if (checkKeyIsNativeOn(key) && !isHTMLElement) {
      const _key = removeNativeOn(key)
      vNodeData.nativeOn = vNodeData.nativeOn || {}
      vNodeData.nativeOn[_key] = value
      continue
    }

    // onInput, v-on:input, vOn:input
    if (checkKeyIsOnEvent(key)) {
      const _key = removeOn(key)
      vNodeData.on[_key] = value
      continue
    }

    // slot.
    if (checkKeyIsSlot(key)) {
      vNodeData.slot = value
      continue
    }

    // scopedSlots.
    if (checkKeyIsScopedSlots(key)) {
      vNodeData.scopedSlots = value
      continue
    }

    // v-model, vModel.
    if (checkKeyIsVModel(key)) {
      dealWithVModel(tag, key, config, vNodeData, isHTMLElement)
      continue
    }

    // ref.
    if (checkKeyIsRef(key)) {
      vNodeData.ref = value
      continue
    }

    // v-dir, vDir
    if (checkKeyIsVueDirective(key)) {
      dealWithDirective(key, vNodeData, config)
      continue
    }

    // Transform v-bind:xx to xx.
    if (V_BIND_REGEXP.test(key)) {
      key = key.replace(V_BIND_REGEXP, '')
    }

    if (isHTMLElement) {
      if (checkKeyIsHtmlAttr(key)) {
        vNodeData.attrs[key] = value
      } else {
        vNodeData.domProps[key] = value
      }
    } else {
      vNodeData.props[key] = value
    }
  }

  // Check if it is JSXS function.
  const isJsxsFunc = typeof tag === 'function' && isUndefined((tag as any).cid)
  if (isJsxsFunc) {
    return h({
      render: tag as any
    })
  }

  return h(tag, vNodeData, isArray(config.children) ? config.children : [config.children])
}

export {
  jsx
}
