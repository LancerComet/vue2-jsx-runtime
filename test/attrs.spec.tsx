/* eslint-disable no-undef */

import { shallowMount } from '@vue/test-utils'
import { defineComponent, nextTick, onMounted, PropType, ref } from '@vue/composition-api'

describe('HTML testing.', () => {
  it('It should deal with static attrs.', () => {
    const wrapper = shallowMount({
      setup () {
        return () => (
          <div
            id='an-id' class='this-is-class'
            data-type='element'
            aria-label='label' role='button'
          ></div>
        )
      }
    })
    expect(wrapper.html()).toBe('<div data-type="element" aria-label="label" role="button" class="this-is-class" id="an-id"></div>')
  })

  it('It should deal with reactive attrs.', done => {
    const Comp = {
      setup () {
        const idRef = ref(0)
        const classRef = ref(0)
        const contentRef = ref('Doge')

        const increase = () => {
          idRef.value++
          classRef.value++
          contentRef.value = 'Doge II'

          nextTick(() => {
            expect(wrapper.html()).toBe('<div data-id="id-1" class="static class-1" id="id-1">Doge II</div>')
            done()
          })
        }

        const check = () => {
          // Wait wrapper is initialized.
          setTimeout(() => {
            expect(wrapper.html()).toBe('<div data-id="id-0" class="static class-0" id="id-0">Doge</div>')
            increase()
          }, 500)
        }

        onMounted(check)

        return () => (
          <div
            id={'id-' + idRef.value}
            class={[
              'static',
              'class-' + classRef.value
            ]}
            data-id={'id-' + idRef.value}
          >{contentRef.value}</div>
        )
      }
    }

    const wrapper = shallowMount(Comp)
  })
})

describe('Vue component testing.', () => {
  it('It should deal with attrs properly.', () => {
    const Example = defineComponent({
      name: 'Example',
      setup () {
        return () => (
          <div></div>
        )
      }
    })

    const Wrapper = defineComponent({
      name: 'Wrapper',
      setup () {
        const classRef = ref('hey-class')

        return () => (
          <div>
            <Example
              style={{
                'background-color': 'red',
                color: 'rgb(0, 0, 0)'
              }}
              ariaLabel='label' // Should be ignored.
              aria-autocomplete="both" // Should be ignored.
            />
            <Example class={classRef.value} role='button' />
          </div>
        )
      }
    })

    const wrapper = shallowMount(Wrapper)
    expect(wrapper.html()).toBe(
      '<div>\n' +
      '  <div style="background-color: red; color: rgb(0, 0, 0);"></div>\n' +
      '  <div class="hey-class"></div>\n' +
      '</div>'
    )
  })

  it('It should deal with props properly.', () => {
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
      '</div>'
    )
  })
})
