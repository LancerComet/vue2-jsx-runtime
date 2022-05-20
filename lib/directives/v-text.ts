import { VNodeData } from 'vue'

const dealWithVText = (
  vNodeData: VNodeData,
  bindingValue: unknown
) => {
  vNodeData.domProps.textContent = bindingValue
}

export {
  dealWithVText
}
