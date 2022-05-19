/* eslint-disable no-undef */

import { defineAsyncComponent, defineComponent } from '@vue/composition-api'
import { mount } from '@vue/test-utils'
import { sleep } from './utils/sleep'

it('Async component should work properly.', async () => {
  const Example = defineAsyncComponent(async () => {
    await sleep(10)
    return defineComponent({
      setup () {
        return () => (
          <span>Greeting!</span>
        )
      }
    })
  })

  const Example2: any = {
    components: {
      Example
    },
    render: h => h('Example')
  }

  const Wrapper = defineComponent({
    name: 'Wrapper',
    setup () {
      return () => (
        <div>
          <h1>Title</h1>
          <Example2 />
        </div>
      )
    }
  })

  const wrapper = mount(Wrapper)
  await sleep(20)
  expect(wrapper.html()).toBe(
    '<div>\n' +
    '  <h1>Title</h1><span>Greeting!</span>\n' +
    '</div>'
  )
})
