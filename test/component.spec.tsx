import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'
import { mount } from '@vue/test-utils'

it('Mixing usage should work properly.', () => {
  Vue.component('example', Vue.extend({
    render: h => h('div', ['Example'])
  }))

  const Example = Vue.component('example')
  const Wrapper = defineComponent({
    setup () {
      return () => (
        <Example />
      )
    }
  })

  const wrapper = mount(Wrapper)
  expect(wrapper.html()).toBe('<div>Example</div>')
})
