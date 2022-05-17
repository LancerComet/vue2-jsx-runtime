/* eslint-disable no-undef */

import Vue from 'vue'
import { defineComponent } from '@vue/composition-api'
import { mount } from '@vue/test-utils'
import { sleep } from './utils/sleep'

const getComponents = async () => {
  await sleep(100)

  const Example = defineComponent({
    setup () {
      return () => (
        <span>Greeting!</span>
      )
    }
  })

  const Example2: any = {
    render: h => h('div', ['Wow', 'Such a div!'])
  }

  const Example3 = Vue.extend({
    render: h => h('div', ['Example 3'])
  })

  return {
    Example, Example2, Example3
  }
}

it('Async component should work properly.', async () => {
  const { Example, Example2, Example3 } = await getComponents()

  const Wrapper = defineComponent({
    name: 'Wrapper',
    setup () {
      return () => (
        <div>
          <h1>Title</h1>
          <Example />
          <Example2 />
          <Example3 />
        </div>
      )
    }
  })

  const wrapper = mount(Wrapper)
  expect(wrapper.html()).toBe(
    '<div>\n' +
    '  <h1>Title</h1><span>Greeting!</span>\n' +
    '  <div>WowSuch a div!</div>\n' +
    '  <div>Example 3</div>\n' +
    '</div>'
  )
})
