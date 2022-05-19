/* eslint-disable no-undef */

import { getDirectiveInfo } from '../lib/modules/directive'
import { defineComponent, ref } from '@vue/composition-api'
import { shallowMount } from '@vue/test-utils'
import { sleep } from './utils/sleep'

describe('Directive testing.', () => {
  it('getDirectiveInfo should work properly.', () => {
    expect(getDirectiveInfo('v-model')).toEqual({
      name: 'model'
    })
    expect(getDirectiveInfo('v-model-a:arg')).toEqual({
      name: 'model-a',
      argument: 'arg'
    })
    expect(getDirectiveInfo('v-model-b-c:a.b.c')).toEqual({
      name: 'model-b-c',
      argument: 'a',
      modifiers: { b: true, c: true }
    })
  })

  it('getDirectiveInfo should work properly with camelCase.', () => {
    expect(getDirectiveInfo('vModel')).toEqual({
      name: 'model'
    })
    expect(getDirectiveInfo('vModelA')).toEqual({
      name: 'model-a'
    })
    expect(getDirectiveInfo('vModelAa')).toEqual({
      name: 'model-aa'
    })
    expect(getDirectiveInfo('vModel2022wd')).toEqual({
      name: 'model2022wd'
    })
    expect(getDirectiveInfo('vModel2022Wd')).toEqual({
      name: 'model2022-wd'
    })
    expect(getDirectiveInfo('vModel:a')).toEqual({
      name: 'model',
      argument: 'a'
    })
    expect(getDirectiveInfo('vModelBcdEf:a.b.c')).toEqual({
      name: 'model-bcd-ef',
      argument: 'a',
      modifiers: { b: true, c: true }
    })
  })

  it('v-show should work properly.', async () => {
    const isDisplayRef = ref(true)
    const Example = defineComponent({
      setup () {
        return () => (
          <div v-show={isDisplayRef}>Wow</div>
        )
      }
    })
    const wrapper = shallowMount(Example)
    expect(wrapper.isVisible()).toBe(true)

    isDisplayRef.value = false
    await sleep(10)
    expect(wrapper.isVisible()).toBe(false)
  })
})
