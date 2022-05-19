# Vue 2 JSX Runtime

[![npm version](https://badge.fury.io/js/@lancercomet%2Fvue2-jsx-runtime.svg)](https://badge.fury.io/js/@lancercomet%2Fvue2-jsx-runtime)
![Testing](https://github.com/LancerComet/vue2-jsx-runtime/workflows/Test/badge.svg)

This is a package for handling Vue 2 JSX, you can use it with your favourite toolchain like SWC, TSC, Vite* to convert Vue 2 JSX.

## What's the different between this and Vue official solution?

The official Vue 2 JSX support uses Babel to convert JSX to Vue render function, so your workflow would be like:

```
JSX -> Babel -> Vite (ESBuild) / TSC / SWC -> JS  
```

The Babel just slows down the whole process, and we all know that these compilers actually support JSX transforming out of box. So if we have a Vue 2 JSX transformer for these compilers, we can just get rid of Babel.

Fortunately, TSC and SWC support using `jsxImportSource` to decide which JSX factory module we gonna use. So if you use this package, you will be able to use Vue 2 JSX without Babel.

## Setup

First please make sure `Vue@2` has been installed in your project, then

```
npm install @lancercomet/vue2-jsx-runtime --save
```

### TSC

Update your `tsconfig.json` with:

```js
{
  "compilerOptions": {
    ...
    "jsx": "react-jsx",  // Please set to "react-jsx". 
    "jsxImportSource": "@lancercomet/vue2-jsx-runtime"  // Please set to package name.
  }
}
```

> The reason why "jsx" should be set to "react-jsx" is this plugin matches the new JSX transform.

### SWC

In `tsconfig.json`:

```js
{
  "compilerOptions": {
    ...
    "jsx": "preserve"  // Please set to "preserve". 
  }
}
```

And in `.swcrc`:

```js
{
  "jsc": {
    "transform": {
      "react": {
        "runtime": "automatic",  // Please set to "automatic" to enable new JSX transform.
        "importSource": "@lancercomet/vue2-jsx-runtime",  // Please set to package name.
        "throwIfNamespace": false
      }
    }
  }
}
```

## Usage

### On event

```tsx
// Evenet handler on HTML element.
<button onClick={onClick}>Click me</button>

// Event handler on Vue component.
<MyComponent onTrigger={onTrigger} />

// Using "on" to assign multiple events for once.
<div on={{
  click: onClick,
  focus: onFocus,
  blur: onBlur
}}></div>
```

### Native on

```tsx
<MyComponent onClick:native={onClick} />
```

Native is only available for Vue components.

### HTML / Component ref

```tsx
import { ComponentPublicInstance, defineComponent, onMounted } from '@vue/composition-api'

const Example = defineComponent({
  setup () {
    return () => (
      <div>Example goes here</div>
    )
  }
})

const Wrapper = defineComponent({
  setup (_, { refs }) {
    onMounted(() => {
      const div = refs.doge as HTMLElement
      const example = refs.example as ComponentPublicInstance<any>
    })

    return () => (
      <div>
        <div ref='doge'>Wow very doge</div>
        <Example ref='example'/>
      </div>
    )
  }
})
```

Due to limitations, using ref is a little different form to Vue 3.

You can check [this](https://github.com/vuejs/composition-api#limitations) out for more information.

### Slot

```tsx
const Container = defineComponent({
  setup (_, { slots }) {
    return () => (
      <div>
        { slots.default?.() }
        { slots.slot1?.() }
        { slots.slot2?.() }
      </div>
    )
  }
})

const Example = defineComponent({
  name: 'Example',
  setup (_, { slots }) {
    return () => (
      <div>{ slots.default?.() }</div>
    )
  }
})
```

```tsx
<Container>
  <Example>Default</Example>
  <Example slot='slot1'>Slot1</Example>
  <Example slot='slot2'>Slot2</Example>
</Container>
```

### ScopedSlots

```tsx
const MyComponent = defineComponent({
  props: {
    name: String as PropType<string>,
    age: Number as PropType<number>
  },

  setup (props, { slots }) {
    return () => (
      <div>
        { slots.default?.() }
        { slots.nameSlot?.(props.name) }
        { slots.ageSlot?.(props.age) }
      </div>
    )
  }
})
```

```tsx
<MyComponent
  name='John Smith'
  age={100}
  scopedSlots={{
    default: () => <div>Default</div>,
    nameSlot: (name: string) => <div>Name: {name}</div>,
    ageSlot: (age: number) => {
      return <div>Age: {age}</div>
    }
  }}
/>
```

Output:

```html
<div>
  <div>Default</div>
  <div>Name: John Smith</div>
  <div>Age: 100</div>
</div>
```

### v-model

It only supports using `v-model` on **HTML elements**, for now you cannot use v-model on Vue component. So please use `value` and `onUpdate` separately.

#### Regular usage

```tsx
import ref from '@vue/composition-api'
import Vue from 'vue'

// In composition API
const Example = defineComponent({
  setup (_, { refs }) {
    const nameRef = ref('')
    return () => (
      <div>
        <input v-model={nameRef}/>
      </div>
    )
  }
})

// In render function.
const Example = Vue.extend({
  data: () => ({
    name: ''
  }),
  render: () => <input v-model='name'/>
})
```

#### With modifiers

```tsx
const Example = Vue.extend({
  data: () => ({
    name: '',
    age: 0
  }),
  render: () => (
    <div>
      <input v-model={['name', ['lazy']]}/>
      <input v-model={['age', ['number']]}/>
    </div>
  )
})

const Example = defineComponent({
  setup () {
    const nameRef = ref('')
    const ageRef = ref(0)
    
    return () => (
      <div>
        <input v-model={[nameRef, ['lazy']]}/>
        <input v-model={[agRef, ['number']]}/>
      </div>
    )
  }
})
```

#### With argument

```tsx
const Example = defineComponent({
  setup () {
    const nameRef = ref('')
    const ageRef = ref(0)
    
    return () => (
      <div>
        <input v-model={[nameRef, 'value', ['lazy']]}/>
        <input v-model={[agRef, 'value', ['number']]}/>
      </div>
    )
  }
})
```

#### About IME

By default, `v-model` will only assign what you have selected from IME. If you were typing in IME, `v-model` would do nothing.

If you want to disable this behavior, add `direct` modifier:

```tsx
{/* It will sync everything you have typed in IME. */}
<input v-model={[userInputRef, ['direct']]}>

{/* By default, it will only assign what you have selected from IME. */}
<input v-model={userInputRef} >
```

### Fragment (experimental)

Vue 2 doesn't come with fragment support so this feature is supported by [vue-fragment](https://github.com/Thunberg087/vue-fragment) under the hood:

```tsx
<div>
  <>
    <h1>Wow such a fragment</h1>
    <small>I can smell it</small>
  </>
</div>
```

This will be rendered as

```html
<div>
  <!--fragment#head-->
  <h1>Wow such a fragment</h1>
  <small>I can smell it</small>
  <!--fragment#tail-->
</div>
```

## For Vite users

For Vite users, it's better to use TSC or SWC instead of built-in ESBuild. Because ESBuild is very finicky at handling JSX for now, and it gives you no room to change its behavior.

For faster compilation, SWC is recommended. You can use [unplugin-swc](https://github.com/egoist/unplugin-swc) to make Vite uses SWC.

Once you have switched to SWC (TSC) from ESBuild, you will not only be able to use this package, but also get more features like `emitDecoratorMetadata` which is not supported by ESBuild, and the whole process is still darn fast.

## References

 - [Introducing the New JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
 - [Render Function](https://vuejs.org/guide/extras/render-function.html)
 - [vue-jsx-runtime (Vue 3)](https://github.com/dolymood/vue-jsx-runtime)
 - [@vue/composition-api](https://github.com/vuejs/composition-api)
 - [@vue/babel-plugin-jsx](https://github.com/vuejs/babel-plugin-jsx)
