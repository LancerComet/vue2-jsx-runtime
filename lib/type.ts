import { AsyncComponent, Component } from 'vue/types/options'
import { VNodeChildren } from 'vue'

type TagType = string | Component<any, any, any, any> | AsyncComponent<any, any, any, any> | (() => Component)

type ConfigType = {
  children?: VNodeChildren
  [props: string]: any
}

export {
  TagType,
  ConfigType
}
