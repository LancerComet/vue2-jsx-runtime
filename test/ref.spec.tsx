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
        <div ref='r1' refInFor>Wow very doge1</div>
        <div ref='r1' refInFor>Wow very doge2</div>
        <div ref='r1' refInFor>Wow very doge3</div>
      </div>
    ),
    mounted () {
      const refs = this.$refs
      const doge = refs.doge as HTMLElement
      expect(doge.tagName.toLowerCase()).toBe('div')
      expect(doge.textContent).toBe('Wow very doge')

      const example = refs.example as ComponentPublicInstance<any, any>
      expect(example.$el.textContent).toBe('Example')

      const multiRefs = refs.r1
      expect(Array.isArray(multiRefs)).toBe(true)
      expect(multiRefs.map(r => r.textContent))
        .toEqual(Array.from({ length: 3 }, (_, idx) => `Wow very doge${idx + 1}`))

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
