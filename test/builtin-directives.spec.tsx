/* eslint-disable no-undef */

import { defineComponent, ref } from '@vue/composition-api'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import { getDirectiveInfo } from '../lib/directives'
import { sleep } from './utils/sleep'

describe('Directive util testing.', () => {
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
})

describe('v-show', () => {
  it('v-show should work properly (Ref).', async () => {
    const isDisplayRef = ref(true)
    const Example = defineComponent({
      setup () {
        return () => (
          <div v-show={isDisplayRef.value}>Wow</div>
        )
      }
    })
    const wrapper = shallowMount(Example)
    expect(wrapper.isVisible()).toBe(true)

    isDisplayRef.value = false
    await sleep(10)
    expect(wrapper.isVisible()).toBe(false)
  })

  it('v-show should work properly (Render function).', async () => {
    const Example = Vue.extend({
      data () {
        return { isDisplay: true }
      },
      render () {
        return <div v-show={this.isDisplay}>Wow</div>
      }
    })
    const wrapper = shallowMount(Example)
    expect(wrapper.isVisible()).toBe(true)

    wrapper.vm.isDisplay = false
    await sleep(10)
    expect(wrapper.isVisible()).toBe(false)
  })
})

describe('v-text', () => {
  it('v-text should work properly.', () => {
    const wrapper = shallowMount(Vue.extend({
      data () {
        return {
          text: 'John Smith'
        }
      },
      render () {
        return (
          <div>
            <div v-text={this.text}></div>
            <div vText={this.text}></div>
            <div textContent={this.text}></div>
          </div>
        )
      }
    }))

    expect(wrapper.html()).toBe(
      '<div>\n' +
      '  <div>John Smith</div>\n' +
      '  <div>John Smith</div>\n' +
      '  <div>John Smith</div>\n' +
      '</div>'
    )
  })
})

describe('v-html', () => {
  it('v-html should work properly.', () => {
    const wrapper = shallowMount(defineComponent({
      setup () {
        const htmlRef = ref('<h1>Title</h1>')

        return () => (
          <div>
            <div v-html={htmlRef.value}></div>
            <div vHtml={htmlRef.value}></div>
            <div innerHTML={htmlRef.value}></div>
          </div>
        )
      }
    }))

    expect(wrapper.html()).toBe(
      '<div>\n' +
      '  <div>\n' +
      '    <h1>Title</h1>\n' +
      '  </div>\n' +
      '  <div>\n' +
      '    <h1>Title</h1>\n' +
      '  </div>\n' +
      '  <div>\n' +
      '    <h1>Title</h1>\n' +
      '  </div>\n' +
      '</div>'
    )
  })
})
