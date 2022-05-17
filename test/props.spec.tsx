/* eslint-disable no-undef */

import { defineComponent, PropType, ref } from '@vue/composition-api'
import { mount } from '@vue/test-utils'

it('Props should work properly.', (done) => {
  const Example = defineComponent({
    name: 'Example',
    props: {
      name: {
        type: String as PropType<string>,
        default: ''
      },
      age: {
        type: Number as PropType<number>,
        default: 0
      }
    },

    setup (props) {
      const Content = () => (
        <span>Name: {props.name}, age: {props.age}</span>
      )

      return () => (
        <Content />
      )
    }
  })

  const Wrapper = defineComponent({
    name: 'Wrapper',
    setup () {
      const nameRef = ref('LancerComet')
      const ageRef = ref(0)

      const onDispatch = () => {
        nameRef.value = 'John Smith'
        ageRef.value = 1
      }

      return () => (
        <div>
          <Example name={nameRef.value} age={ageRef.value} />
          <button onClick={onDispatch} class='dispatch'></button>
        </div>
      )
    }
  })

  const wrapper = mount(Wrapper)
  expect(wrapper.html()).toBe('<div><span>Name: LancerComet, age: 0</span><button class="dispatch"></button></div>')

  const btn = wrapper.find('button.dispatch')
  btn.trigger('click')
  setTimeout(() => {
    expect(wrapper.html()).toBe('<div><span>Name: John Smith, age: 1</span><button class="dispatch"></button></div>')
    done()
  }, 100)
})
