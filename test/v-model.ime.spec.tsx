/* eslint-disable no-undef */

import { defineComponent, ref } from '@vue/composition-api'
import { shallowMount } from '@vue/test-utils'
import { sleep } from './utils/sleep'

describe('v-model IME testing.', () => {
  it('It should work properly when using IME.', async () => {
    const userInputRef = ref('')

    const Example = defineComponent({
      setup () {
        return () => (
          <input v-model={userInputRef} />
        )
      }
    })

    const wrapper = shallowMount(Example)
    const input = wrapper.find('input')
    const inputElement = input.element as HTMLInputElement

    input.trigger('compositionstart')
    await sleep(10)
    inputElement.value = 'wow i am typing in ime and i wanna select some japanese character'
    input.trigger('input')
    await sleep(10)
    expect(userInputRef.value).toBe('')

    input.trigger('compositionend')
    await sleep(10)
    expect(userInputRef.value).toBe('wow i am typing in ime and i wanna select some japanese character')
  })

  it('Direct mode should work properly when using IME.', async () => {
    const userInputRef = ref()

    const Example = defineComponent({
      setup () {
        return () => (
          <input v-model={[userInputRef, ['direct']]} />
        )
      }
    })

    const wrapper = shallowMount(Example)
    const input = wrapper.find('input')
    const inputElement = input.element as HTMLInputElement

    input.trigger('compositionstart')
    await sleep(10)
    inputElement.value = 'wow i am typing in ime and i wanna select some japanese character'
    input.trigger('input')
    await sleep(10)
    expect(userInputRef.value).toBe('wow i am typing in ime and i wanna select some japanese character')

    input.trigger('compositionend')
    await sleep(10)
    expect(userInputRef.value).toBe('wow i am typing in ime and i wanna select some japanese character')
  })
})
