/* eslint-disable no-undef */

import { mount, shallowMount } from '@vue/test-utils'
import { defineComponent } from '@vue/composition-api'

it('A simple element should work.', () => {
  const wrapper = shallowMount({
    setup () {
      return () => (
        <div>Wow such a div</div>
      )
    }
  })
  expect(wrapper.text()).toBe('Wow such a div')
})

it('Root component should work properly.', () => {
  const Example = defineComponent({
    setup () {
      return () => (
        <div>Example</div>
      )
    }
  })

  const wrapper = shallowMount({
    setup () {
      return () => (
        <Example />
      )
    }
  })
  expect(wrapper.html()).toBe('<div>Example</div>')
})

it('Wrapped component should work properly.', () => {
  const Example = defineComponent({
    name: 'Example',
    setup () {
      return () => (
        <div class='example'>Example</div>
      )
    }
  })

  const Wrapper = defineComponent({
    name: 'Wrapper',
    setup () {
      return () => (
        <div>
          <Example />
        </div>
      )
    }
  })

  const wrapper = mount(Wrapper)
  expect(wrapper.html()).toBe(
    '<div>\n' +
    '  <div class="example">Example</div>\n' +
    '</div>'
  )
})
