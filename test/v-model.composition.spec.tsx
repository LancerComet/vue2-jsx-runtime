/* eslint-disable no-undef */
import { defineComponent, ref } from '@vue/composition-api'
import { shallowMount } from '@vue/test-utils'
import { sleep } from './utils/sleep'
import { getValueFromObject, setValueToObject } from '../lib/utils'

describe('v-model composition API testing.', () => {
  it('v-model on text input should work properly,', async () => {
    const userInputRef = ref('')

    const Example = defineComponent({
      setup () {
        return () => (
          <input type='text' v-model={userInputRef} />
        )
      }
    })

    const wrapper = shallowMount(Example)
    const input = wrapper.find('input')
    const inputElement = input.element as HTMLInputElement

    inputElement.value = 'LancerComet'
    input.trigger('input')
    await sleep(10)
    expect(userInputRef.value).toBe('LancerComet')

    userInputRef.value = 'Wow such a v-model'
    await sleep(10)
    expect(inputElement.value).toBe('Wow such a v-model')

    userInputRef.value = ''
    await sleep(10)

    input.trigger('compositionstart')
    inputElement.value = 'using ime'
    await sleep(10)
    expect(userInputRef.value).toBe('')
    input.trigger('compositionend')
    await sleep(10)
    expect(userInputRef.value).toBe('using ime')
  })

  it('Radio binding should work properly.', async () => {
    const genderRef = ref<'male' | 'female'>()

    const Example = defineComponent({
      setup () {
        return () => (
          <div>
            <input class='male' type="radio" value='male' v-model={genderRef}/>
            <input class='female' type="radio" value='female' v-model={genderRef}/>
          </div>
        )
      }
    })

    const wrapper = shallowMount(Example)
    const maleInput = wrapper.find('input.male')
    const femaleInput = wrapper.find('input.female')

    maleInput.trigger('change')
    await sleep(10)
    expect(genderRef.value).toBe('male')
    expect((maleInput.element as HTMLInputElement).checked).toBe(true)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(false)

    femaleInput.trigger('change')
    await sleep(10)
    expect(genderRef.value).toBe('female')
    expect((maleInput.element as HTMLInputElement).checked).toBe(false)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(true)

    genderRef.value = 'male'
    await sleep(10)
    expect((maleInput.element as HTMLInputElement).checked).toBe(true)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(false)

    genderRef.value = 'female'
    await sleep(10)
    expect((maleInput.element as HTMLInputElement).checked).toBe(false)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(true)

    genderRef.value = undefined
    await sleep(10)
    expect((maleInput.element as HTMLInputElement).checked).toBe(false)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(false)
  })

  it('Checkbox binding should work properly. (default single)', async () => {
    const userInputRef = ref<unknown>()

    const Example = defineComponent({
      setup () {
        return () => (
          <div>
            <input class='checkbox' type="checkbox" v-model={userInputRef}/>
          </div>
        )
      }
    })

    const wrapper = shallowMount(Example)
    const checkboxInput = wrapper.find('input.checkbox')
    const checkboxInputElement = checkboxInput.element as HTMLInputElement

    expect(checkboxInputElement.value).toBe('on')
    expect(checkboxInputElement.checked).toBe(false)

    // input -> value
    checkboxInputElement.checked = true
    checkboxInput.trigger('change')
    await sleep(10)
    expect(checkboxInputElement.checked).toBe(true)
    expect(userInputRef.value).toBe('on')

    checkboxInputElement.checked = false
    checkboxInput.trigger('change')
    await sleep(10)
    expect(checkboxInputElement.checked).toBe(false)
    expect(userInputRef.value).toBe(undefined)

    // value -> input
    userInputRef.value = 'on'
    await sleep(10)
    expect(checkboxInputElement.checked).toBe(true)

    userInputRef.value = undefined
    await sleep(10)
    expect(checkboxInputElement.checked).toBe(false)
  })

  it('Checkbox binding should work properly. (single)', async () => {
    const genderRef = ref<'male' | 'female'>()

    const Example = defineComponent({
      setup () {
        return () => (
          <div>
            <input class='male' type="checkbox" value='male' v-model={genderRef}/>
            <input class='female' type="checkbox" value='female' v-model={genderRef}/>
          </div>
        )
      }
    })

    const wrapper = shallowMount(Example)
    const maleInput = wrapper.find('input.male')
    const femaleInput = wrapper.find('input.female')

    maleInput.trigger('change')
    await sleep(10)
    expect(genderRef.value).toBe('male')
    expect((maleInput.element as HTMLInputElement).checked).toBe(true)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(false)

    femaleInput.trigger('change')
    await sleep(10)
    expect(genderRef.value).toBe('female')
    expect((maleInput.element as HTMLInputElement).checked).toBe(false)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(true)

    genderRef.value = 'male'
    await sleep(10)
    expect((maleInput.element as HTMLInputElement).checked).toBe(true)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(false)

    genderRef.value = 'female'
    await sleep(10)
    expect((maleInput.element as HTMLInputElement).checked).toBe(false)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(true)

    genderRef.value = undefined
    await sleep(10)
    expect((maleInput.element as HTMLInputElement).checked).toBe(false)
    expect((femaleInput.element as HTMLInputElement).checked).toBe(false)
  })

  it('Checkbox binding should work properly. (array)', async () => {
    const nameRef = ref<string[]>([])

    const Example = defineComponent({
      setup () {
        return () => (
          <div>
            <input class='john' type="checkbox" value='John' v-model={nameRef}/>
            <input class='smith' type="checkbox" value='Smith' v-model={nameRef}/>
          </div>
        )
      }
    })

    const wrapper = shallowMount(Example)
    const johnInput = wrapper.find('input.john')
    const smithInput = wrapper.find('input.smith')
    const johnInputEl = johnInput.element as HTMLInputElement
    const smithInputEl = smithInput.element as HTMLInputElement

    johnInput.trigger('change')
    await sleep(10)
    expect(nameRef.value).toEqual(['John'])
    expect(johnInputEl.checked).toBe(true)
    expect(smithInputEl.checked).toBe(false)

    smithInput.trigger('change')
    await sleep(10)
    expect(nameRef.value).toEqual(['John', 'Smith'])
    expect(johnInputEl.checked).toBe(true)
    expect(smithInputEl.checked).toBe(true)

    johnInput.trigger('change')
    smithInput.trigger('change')
    await sleep(10)
    expect(nameRef.value).toEqual([])
    expect(johnInputEl.checked).toBe(false)
    expect(smithInputEl.checked).toBe(false)

    nameRef.value = ['John']
    await sleep(10)
    expect(johnInputEl.checked).toBe(true)
    expect(smithInputEl.checked).toBe(false)

    nameRef.value = ['Smith']
    await sleep(10)
    expect(johnInputEl.checked).toBe(false)
    expect(smithInputEl.checked).toBe(true)

    nameRef.value = ['John', 'Smith']
    await sleep(10)
    expect(johnInputEl.checked).toBe(true)
    expect(smithInputEl.checked).toBe(true)

    nameRef.value = []
    await sleep(10)
    expect(johnInputEl.checked).toBe(false)
    expect(smithInputEl.checked).toBe(false)
  })

  it('Deep binding should work properly.', async () => {
    const test = async (keyPath: string, initValue: any, finalValue: any) => {
      const inputRef = ref({
        username: '',
        detail: {
          age: '0'
        }
      })

      setValueToObject(inputRef.value, keyPath, initValue)

      const Example = defineComponent({
        setup () {
          return () => (
            <input type='text' v-model={[inputRef, keyPath]} />
          )
        }
      })

      const wrapper = shallowMount(Example)
      const input = wrapper.find('input')
      const inputElement = input.element as HTMLInputElement

      expect(inputElement.value).toBe(initValue)

      inputElement.value = finalValue
      input.trigger('input')
      await sleep(10)

      expect(getValueFromObject(inputRef.value, keyPath)).toBe(finalValue)
    }

    await test('username', 'John Smith', 'LancerComet')
    await test('detail.age', '1', '100')
  })
})
