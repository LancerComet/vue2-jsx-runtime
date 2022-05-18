/* eslint-disable no-undef */

import { defineComponent, PropType, ref } from '@vue/composition-api'
import { mount, shallowMount } from '@vue/test-utils'

it('Creating single element should work properly.', () => {
  const wrapper = shallowMount({
    setup () {
      return () => (
        <div>Wow such a div</div>
      )
    }
  })
  expect(wrapper.text()).toBe('Wow such a div')
})

it('Creating single Vue component should work properly.', () => {
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

it('Creating multiple HTML elements should work properly.', () => {
  const Example = defineComponent({
    name: 'Example',
    setup () {
      return () => (
        <div>
          <h1>Wow</h1>
          <p>Such a text</p>
          <div>
            <img src='/01.jpg' />
          </div>
        </div>
      )
    }
  })

  const wrapper = shallowMount(Example)
  expect(wrapper.html()).toBe(
    '<div>\n' +
    '  <h1>Wow</h1>\n' +
    '  <p>Such a text</p>\n' +
    '  <div><img src="/01.jpg"></div>\n' +
    '</div>'
  )
})

it('Creating multiple components should work properly.', () => {
  const Example = defineComponent({
    name: 'Example',
    props: {
      content: {
        type: String as PropType<string>,
        default: 'Example'
      }
    },
    setup (props) {
      return () => (
        <div>{props.content}</div>
      )
    }
  })

  const Wrapper = defineComponent({
    name: 'Wrapper',
    setup () {
      const classRef = ref('hey-class')

      return () => (
        <div>
          <Example style={{
            'background-color': 'red',
            color: 'rgb(0, 0, 0)'
          }} />
          <Example class={classRef.value} content={'LancerComet'} role='button' />
        </div>
      )
    }
  })

  const wrapper = shallowMount(Wrapper)
  expect(wrapper.html()).toBe(
    '<div>\n' +
    '  <div style="background-color: red; color: rgb(0, 0, 0);">Example</div>\n' +
    '  <div class="hey-class">LancerComet</div>\n' +
    '</div>')
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
