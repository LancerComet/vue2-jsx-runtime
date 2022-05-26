/* eslint-disable no-undef */

import { ComponentPublicInstance, defineComponent, onMounted } from '@vue/composition-api'
import { mount, shallowMount } from '@vue/test-utils'
import Vue from 'vue'

it('Ref should work properly.', (done) => {
  const Example = defineComponent({
    setup () {
      return () => (
        <div>Example</div>
      )
    }
  })

  const Wrapper = Vue.extend({
    render: () => (
      <div>
        <Example ref='example' />
        <div ref='doge'>Wow very doge</div>
      </div>
    ),
    mounted () {
      const refs = this.$refs
      const doge = refs.doge as HTMLElement
      expect(doge.tagName.toLowerCase()).toBe('div')
      expect(doge.textContent).toBe('Wow very doge')

      const example = refs.example as ComponentPublicInstance<any, any>
      expect(example.$el.textContent).toBe('Example')

      done()
    }
  })

  mount(Wrapper)
})

it('Ref should work in function component.', (done) => {
  const Example = defineComponent({
    setup (_, { refs }) {
      const Content = () => (
        <div ref='example'>Example</div>
      )

      onMounted(() => {
        expect(refs.example).toBeDefined()
        done()
      })

      return () => (
        <Content />
      )
    }
  })

  shallowMount(Example)
})
