/* eslint-disable no-undef */

import { defineComponent } from '@vue/composition-api'
import { mount } from '@vue/test-utils'

it('Fragment should work.', (done) => {
  const Example = defineComponent({
    setup: () => {
      return () => (
        <>
          <div>Wow such a fragment</div>
          <div>Very Vue</div>
        </>
      )
    }
  })

  const wrapper = mount(defineComponent({
    setup: () => {
      return () => (
        <div>
          <Example />
          <Example />
        </div>
      )
    }
  }))

  setTimeout(() => {
    expect(wrapper.html()).toBe(
      '<div>\n' +
      '  <!--fragment#head-->\n' +
      '  <div>Wow such a fragment</div>\n' +
      '  <div>Very Vue</div>\n' +
      '  <!--fragment#tail-->\n' +
      '  <!--fragment#head-->\n' +
      '  <div>Wow such a fragment</div>\n' +
      '  <div>Very Vue</div>\n' +
      '  <!--fragment#tail-->\n' +
      '</div>'
    )
    done()
  }, 100)
})
