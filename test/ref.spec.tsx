/* eslint-disable no-undef */

import { ComponentPublicInstance, defineComponent } from '@vue/composition-api'
import { mount } from '@vue/test-utils'
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

  // const Wrapper = defineComponent({
  //   setup (_) {
  //     onMounted(() => {
  //       const { refs } = getCurrentInstance()
  //
  //       const doge = refs.doge as HTMLElement
  //       expect(doge.tagName.toLowerCase()).toBe('div')
  //       expect(doge.textContent).toBe('Wow very doge')
  //
  //       const example = refs.example as ComponentPublicInstance<any, any>
  //       expect(example.$el.textContent).toBe('Example')
  //
  //       done()
  //     })
  //
  //     return () => (
  //       <div>
  //         <Example ref='example' />
  //         <div ref='doge'>Wow very doge</div>
  //       </div>
  //     )
  //   }
  // })

  mount(Wrapper)
})
