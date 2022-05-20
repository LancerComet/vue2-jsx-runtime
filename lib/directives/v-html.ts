import { VNodeData } from 'vue'

const dealWithVHTML = (
  vNodeData: VNodeData,
  bindingValue: unknown
) => {
  vNodeData.domProps.innerHTML = bindingValue
}

export {
  dealWithVHTML
}
