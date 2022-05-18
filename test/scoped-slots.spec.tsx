/* eslint-disable no-undef */

import { defineComponent, PropType } from '@vue/composition-api'
import { mount } from '@vue/test-utils'

it('ScopedSlots should work properly.', () => {
  const Container = defineComponent({
    props: {
      name: String as PropType<string>,
      age: Number as PropType<number>
    },

    setup (props, { slots }) {
      return () => (
        <div>
          { slots.default?.() }
          { slots.nameSlot?.(props.name) }
          { slots.ageSlot?.(props.age) }
        </div>
      )
    }
  })

  const wrapper = mount(defineComponent({
    setup () {
      return () => (
        <Container
          name='John Smith'
          age={100}
          scopedSlots={{
            default: () => <div>Default</div>,
            nameSlot: (name: string) => <div>Name: {name}</div>,
            ageSlot: (age: number) => {
              return <div>Age: {age}</div>
            }
          }}
        />
      )
    }
  }))

  expect(wrapper.html()).toBe(
    '<div>\n' +
    '  <div>Default</div>\n' +
    '  <div>Name: John Smith</div>\n' +
    '  <div>Age: 100</div>\n' +
    '</div>'
  )
})
