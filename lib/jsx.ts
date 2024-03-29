import type { VNode, VNodeData } from 'vue'
import Vue from 'vue'
import {
  checkKeyIsVueDirective,
  checkIsHTMLElement,
  checkKeyIsNativeOn,
  checkKeyIsChildren,
  checkKeyIsClass,
  checkKeyIsDomProp,
  checkKeyIsKey,
  checkKeyIsOnEvent,
  checkKeyIsOnObject,
  checkKeyIsScopedSlots,
  checkKeyIsSlot,
  checkKeyIsStyle,
  isArray,
  isUndefined,
  removeNativeOn,
  removeOn,
  checkKeyIsRef,
  checkKeyIsRefInFor,
  checkKeyIsAttrs
} from './utils'
import { dealWithDirective } from './directives'
import { ConfigType, TagType } from './type'
import { getCurrentInstance } from './runtime'

const V_BIND_REGEXP = /^v(-b|B)ind:/
let _jsxsId = 0

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

  // Support for using <transition> and <transition-group>.
  if (tag === 'transition') {
    tag = 'Transition'
  } else if (tag === 'transition-group') {
    tag = 'TransitionGroup'
  }

  // I treat every lowercase string as HTML element.
  // Because in JSX Vue component should be (Upper) CamelCase named.
  const isHTMLElement = checkIsHTMLElement(tag)

  const attrKeys = Object.keys(config)
  for (let key of attrKeys) {
    // attrs
    if (checkKeyIsAttrs(key)) {
      Object.keys(config[key]).forEach(k => {
        config[k] = config[key][k]
        attrKeys.push(k)
      })
      continue
    }

    // Children shouldn't be set in vNodeData.
    if (checkKeyIsChildren(key)) {
      continue
    }

    const value = config[key]

    // Because of 'key' is deprecated in new JSX transform,
    // we gonna use 'v-key' or 'vKey' instead.
    // https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#deprecate-spreading-key-from-objects
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
      // Merge on events.
      vNodeData.on = {
        ...vNodeData.on,
        ...value
      }
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

    // ref.
    if (checkKeyIsRef(key)) {
      vNodeData.ref = value
      continue
    }

    // refInFor.
    if (checkKeyIsRefInFor(key)) {
      vNodeData.refInFor = value
      continue
    }

    // v-xxx, vXxx
    if (checkKeyIsVueDirective(key)) {
      dealWithDirective(tag, key, vNodeData, config, isHTMLElement)
      continue
    }

    // Transform v-bind:xx to xx.
    if (V_BIND_REGEXP.test(key)) {
      key = key.replace(V_BIND_REGEXP, '')
    }

    if (isHTMLElement) {
      if (checkKeyIsDomProp(key)) {
        vNodeData.domProps[key] = value
      } else {
        vNodeData.attrs[key] = value
      }
    } else {
      vNodeData.props[key] = value
    }
  }

  const children = isArray(config.children) ? config.children : [config.children]

  // Check if it is JSXS function.
  // JSXS function must be wrapped into a Vue component, and in order to
  // avoid re-creating component, register it as a global component, and
  // next time it will be taken out from Vue.
  const isJsxsFunc = typeof tag === 'function' && isUndefined((tag as any).cid)
  if (isJsxsFunc) {
    // @ts-ignore
    let jsxsId = tag.__jsxs_id__
    if (!jsxsId) {
      jsxsId = 'jsxs-comp-' + _jsxsId++
      // @ts-ignore
      tag.__jsxs_id__ = jsxsId
      // @ts-ignore
      Vue.component(jsxsId, { render: tag })
    }
    return h(Vue.component(jsxsId), vNodeData, children)
  }

  return h(tag, vNodeData, children)
}

export {
  jsx
}
