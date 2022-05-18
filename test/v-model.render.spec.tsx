/* eslint-disable no-undef */

import { mount, shallowMount } from '@vue/test-utils'
import { sleep } from './utils/sleep'
import Vue from 'vue'
import { defineComponent, ref } from '@vue/composition-api'

describe('v-model render function testing.', () => {
  it('v-model on text input should work properly,', async () => {
    const Example = defineComponent({
      setup () {
        const name = ref('')
        return {
          name
        }
      },
      render: () => <input ref='input' v-model='name'/>
    })

    const wrapper = mount(Example)
    const vm = wrapper.vm as unknown as { name: string }
    const input = wrapper.find('input')
    const inputElement = input.element as HTMLInputElement

    inputElement.value = 'LancerComet'
    input.trigger('input')
    await sleep(10)
    expect(vm.name).toBe('LancerComet')

    vm.name = 'Wow such a v-model'
    await sleep(10)
    expect(inputElement.value).toBe('Wow such a v-model')

    vm.name = ''
    await sleep(10)

    input.trigger('compositionstart')
    inputElement.value = 'using ime'
    await sleep(10)
    expect(vm.name).toBe('')
    input.trigger('compositionend')
    await sleep(10)
    expect(vm.name).toBe('using ime')
  })

  it('Radio binding should work properly.', async () => {
    const Example = Vue.extend({
      data () {
        return {
          gender: 'male'
        }
      },
      render () {
        return (
          <div>
            <input class='male' type='radio' value='male' v-model='gender'/>
            <input class='female' type='radio' value='female' v-model='gender'/>
          </div>
        )
      }
    })

    const wrapper = shallowMount(Example)
    const vm = wrapper.vm
    const maleInput = wrapper.find('input.male')
    const femaleInput = wrapper.find('input.female')

    const maleInputEl = maleInput.element as HTMLInputElement
    const femaleInputElement = femaleInput.element as HTMLInputElement

    maleInput.trigger('change')
    await sleep(10)
    expect(vm.gender).toBe('male')
    expect(maleInputEl.checked).toBe(true)
    expect(femaleInputElement.checked).toBe(false)

    femaleInput.trigger('change')
    await sleep(10)
    expect(vm.gender).toBe('female')
    expect(maleInputEl.checked).toBe(false)
    expect(femaleInputElement.checked).toBe(true)

    vm.gender = 'male'
    await sleep(10)
    expect(maleInputEl.checked).toBe(true)
    expect(femaleInputElement.checked).toBe(false)

    vm.gender = 'female'
    await sleep(10)
    expect(maleInputEl.checked).toBe(false)
    expect(femaleInputElement.checked).toBe(true)

    vm.gender = undefined
    await sleep(10)
    expect(maleInputEl.checked).toBe(false)
    expect(femaleInputElement.checked).toBe(false)
  })

  it('Checkbox binding should work properly. (default single)', async () => {
    const Example = Vue.extend({
      data: () => ({
        userInput: ''
      }),
      render: () => (
        <div>
          <input class='checkbox' type="checkbox" v-model='userInput'/>
        </div>
      )
    })

    const wrapper = shallowMount(Example)
    const vm = wrapper.vm
    const checkboxInput = wrapper.find('input.checkbox')
    const checkboxInputElement = checkboxInput.element as HTMLInputElement

    expect(checkboxInputElement.value).toBe('on')
    expect(checkboxInputElement.checked).toBe(false)

    // input -> value
    checkboxInput.trigger('change')
    await sleep(10)
    expect(vm.userInput).toBe('on')
    expect(checkboxInputElement.checked).toBe(true)

    checkboxInput.trigger('change')
    await sleep(10)
    expect(vm.userInput).toBe(undefined)
    expect(checkboxInputElement.checked).toBe(false)

    // value -> input
    vm.userInput = 'on'
    await sleep(10)
    expect(checkboxInputElement.checked).toBe(true)

    vm.userInput = undefined
    await sleep(10)
    expect(checkboxInputElement.checked).toBe(false)
  })

  it('Checkbox binding should work properly. (single)', async () => {
    const Example = Vue.extend({
      data () {
        return {
          gender: 'male'
        }
      },
      render: () => (
        <div>
          <input class='male' type="checkbox" value='male' v-model='gender'/>
          <input class='female' type="checkbox" value='female' v-model='gender'/>
        </div>
      )
    })

    const wrapper = shallowMount(Example)
    const vm = wrapper.vm
    const maleInput = wrapper.find('input.male')
    const femaleInput = wrapper.find('input.female')

    maleInput.trigger('change')
    await sleep(10)
    expect(vm.gender).toBe('male')
    expect((maleInput.element as HTMLInputElement).checked).toBe(true)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(false)

    femaleInput.trigger('change')
    await sleep(10)
    expect(vm.gender).toBe('female')
    expect((maleInput.element as HTMLInputElement).checked).toBe(false)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(true)

    vm.gender = 'male'
    await sleep(10)
    expect((maleInput.element as HTMLInputElement).checked).toBe(true)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(false)

    vm.gender = 'female'
    await sleep(10)
    expect((maleInput.element as HTMLInputElement).checked).toBe(false)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(true)

    vm.gender = undefined
    await sleep(10)
    expect((maleInput.element as HTMLInputElement).checked).toBe(false)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(false)
  })

  it('Checkbox binding should work properly. (array)', async () => {
    const Example = Vue.extend({
      data: () => ({
        name: []
      }),
      render: () => (
        <div>
          <input class='john' type="checkbox" value='John' v-model='name'/>
          <input class='smith' type="checkbox" value='Smith' v-model='name'/>
        </div>
      )
    })

    const wrapper = shallowMount(Example)
    const vm = wrapper.vm
    const johnInput = wrapper.find('input.john')
    const smithInput = wrapper.find('input.smith')
    const johnInputEl = johnInput.element as HTMLInputElement
    const smithInputEl = smithInput.element as HTMLInputElement

    johnInput.trigger('change')
    await sleep(10)
    expect(vm.name).toEqual(['John'])
    expect(johnInputEl.checked).toBe(true)
    expect(smithInputEl.checked).toBe(false)

    smithInput.trigger('change')
    await sleep(10)
    expect(vm.name).toEqual(['John', 'Smith'])
    expect(johnInputEl.checked).toBe(true)
    expect(smithInputEl.checked).toBe(true)

    johnInput.trigger('change')
    smithInput.trigger('change')
    await sleep(10)
    expect(vm.name).toEqual([])
    expect(johnInputEl.checked).toBe(false)
    expect(smithInputEl.checked).toBe(false)

    vm.name = ['John']
    await sleep(10)
    expect(johnInputEl.checked).toBe(true)
    expect(smithInputEl.checked).toBe(false)

    vm.name = ['Smith']
    await sleep(10)
    expect(johnInputEl.checked).toBe(false)
    expect(smithInputEl.checked).toBe(true)

    vm.name = ['John', 'Smith']
    await sleep(10)
    expect(johnInputEl.checked).toBe(true)
    expect(smithInputEl.checked).toBe(true)

    vm.name = []
    await sleep(10)
    expect(johnInputEl.checked).toBe(false)
    expect(smithInputEl.checked).toBe(false)
  })
})
