/* eslint-disable no-undef */
import { defineComponent } from '@vue/composition-api'
import { mount } from '@vue/test-utils'

it('Slot should work properly.', () => {
  const Container = defineComponent({
    setup (_, { slots }) {
      return () => (
        <div>
          { slots.default?.() }
          { slots.slot1?.() }
          { slots.slot2?.() }
        </div>
      )
    }
  })

  const Example = defineComponent({
    name: 'Example',
    setup (_, { slots }) {
      return () => (
        <div>{ slots.default?.() }</div>
      )
    }
  })

  const wrapper = mount(defineComponent({
    setup () {
      return () => (
        <Container>
          <Example>Default</Example>
          <Example slot='slot1'>Slot1</Example>
          <Example slot='slot2'>Slot2</Example>
        </Container>
      )
    }
  }))

  expect(wrapper.html()).toBe(
    '<div>\n' +
    '  <div>Default</div>\n' +
    '  <div>Slot1</div>\n' +
    '  <div>Slot2</div>\n' +
    '</div>'
  )
})
