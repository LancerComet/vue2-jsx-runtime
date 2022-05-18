/* eslint-disable no-undef */

import { ComponentPublicInstance, defineComponent, onMounted } from '@vue/composition-api'
import { mount } from '@vue/test-utils'

it('Ref should work properly.', (done) => {
  const Example = defineComponent({
    setup () {
      return () => (
        <div>Example</div>
      )
    }
  })

  const Wrapper = defineComponent({
    setup (_, { refs }) {
      onMounted(() => {
        const doge = refs.doge as HTMLElement
        expect(doge.tagName.toLowerCase()).toBe('div')
        expect(doge.textContent).toBe('Wow very doge')

        const example = refs.example as ComponentPublicInstance<any, any>
        expect(example.$el.textContent).toBe('Example')

        done()
      })

      return () => (
        <div>
          <Example ref='example' />
          <div ref='doge'>Wow very doge</div>
        </div>
      )
    }
  })

  mount(Wrapper)
})
