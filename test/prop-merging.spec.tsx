/* eslint-disable no-undef */

import { defineComponent, PropType } from '@vue/composition-api'
import { shallowMount } from '@vue/test-utils'

describe('Prop merging test.', () => {
  it('Merge props should work properly.', () => {
    const Example = defineComponent({
      props: {
        name: String as PropType<string>,
        age: Number as PropType<number>
      },
      setup (props) {
        return () => (
          <div>Name: {props.name}, age: {props.age}</div>
        )
      }
    })

    const wrapper = shallowMount(defineComponent({
      setup () {
        const props = {
          name: 'John Smith',
          age: 100
        }

        return () => (
          <Example { ...props } />
        )
      }
    }))

    expect(wrapper.html()).toBe('<div>Name: John Smith, age: 100</div>')
  })

  it('Merge props should work properly.', () => {
    const Example = defineComponent({
      props: {
        name: String as PropType<string>,
        age: Number as PropType<number>,
        gender: String as PropType<string>
      },
      setup (props) {
        return () => (
          <div>Name: {props.name}, age: {props.age}, gender: {props.gender}</div>
        )
      }
    })

    const wrapper = shallowMount(defineComponent({
      setup () {
        const props = {
          name: 'John Smith',
          age: 100
        }

        return () => (
          <Example { ...props } gender='male' />
        )
      }
    }))

    expect(wrapper.html()).toBe('<div>Name: John Smith, age: 100, gender: male</div>')
  })
})
