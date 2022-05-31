# Vue 2 JSX Runtime

[![npm version](https://badge.fury.io/js/@lancercomet%2Fvue2-jsx-runtime.svg)](https://badge.fury.io/js/@lancercomet%2Fvue2-jsx-runtime)
![Testing](https://github.com/LancerComet/vue2-jsx-runtime/workflows/Test/badge.svg)

This package is designed for handling Vue 2 JSX.

## What's the different between this and the official solution?

The official solution is a set of Babel plugins which convert JSX to Vue render function, and this package is the [New JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) implement for Vue 2. They are just two different ways to achieve the goal.

For TypeScript users, when you use the official solution your workflow would be like:

```
TSX -> Babel -> Vite (ESBuild) / TSC / SWC -> JS  
```

The Babel just slows down the whole process, and we all know that these compilers actually support JSX transforming out of box. So if we have a Vue 2 New JSX Transform runtime for those compilers, we can just get rid of Babel.

For JavaScript users, you have to use Babel with it to transform JSX into JavaScript codes. [This example](https://github.com/LancerComet/vue2-jsx-runtime-webpack) shows how to use it with Babel and Webpack.

The reasons I developed this package:

 1. I want to use Vite (it's fast) without ESBuild (doesn't support EmitDecoratorMetadata), so I have to use SWC + Vite, and I also need Vue 2 JSX support, but I don't want to bring Babel in.
 3. Using `v-model` in `JSX-returing-setup()` with the official solution will break the Vue 2 app. It has been a long time but still not being fixed yet.

## Setup

First, please make sure `Vue@2` has been installed in your project, then

```
npm install @lancercomet/vue2-jsx-runtime --save
```

### Using TSC

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

> The reason why "jsx" should be set to "react-jsx" is this plugin has to meet the new JSX transform.

### Using SWC

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

### For JavaScript users

You can use it with [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). You can [check this out](https://github.com/LancerComet/vue2-jsx-runtime-webpack) to see how to use it with Babel and Webpack.

### For Vite

Please read the section below.

## Usage

### Passing Value

#### Setup

```tsx
defineComponent({
  setup () {
    const isDisabledRef = ref(false)
    return () => (
      <button disabled={isDisabledRef.value}>Wow such a button</button>
    )
  }
})
```

#### Render function

```tsx
Vue.extend({
  data () {
    return {
      isDisabled: false
    }
  },
  render () {
    return (
      <button disabled={this.isDisabled}>Very button</button>
    )
  }
})

```

### On

#### Setup

```tsx
setup () {
  const onClick = () => {}
  return () => (
    <button onClick={onClick}>Click me</button>
  )
}
```

#### Render function

```tsx
Vue.extend({
  methods: {
    onClick () {}
  },
  render () {
    return <button onClick={this.onClick}>Click me</button>
  }
})
```

#### Using "on" object to assign multiple events for once

```tsx
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

### Rendering HTML or text

```tsx
// Setting HTML.
<div v-html={htmlStrRef.value}></div>   // Using Vue directive.
<div innerHTML='<h1>Title</h1>'></div>  // Using dom prop.

// Setting text.
<div v-text={this.displayText}></div>   // Using Vue directive.
<div textContent={'Very Vue'}></div>    // Using dom prop.
```

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

Due to limitations, using ref is a little different from to Vue 3.

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

### Built-in directives

#### Setup

```tsx
defineComponent({
  setup () {
    const isDisplayRef = ref(false)
    const textContentRef = ref('John Smith')
    const htmlContentRef = ref('<h1>John Smith</h1>')

    return () => (
      <div>
        <div v-show={isDisabledRef.value}>Page content</div>
        <div v-text={textContentRef.value}></div>
        <div v-html={htmlContentRef.value}></div>
      </div>
    )
  }
})
```

#### Render function

```tsx
Vue.extend({
  data () {
    return {
      isDisplay: false,
      textContent: 'John Smith',
      htmlContent: '<h1>John Smith</h1>'
    }
  },
  render () {
    return (
      <div>
        <div v-show={this.isDisplay}>Page content</div>
        <div v-text={this.textContent}></div>
        <div v-html={this.htmlContent}></div>
      </div>
    )
  }
})
```

### v-model

#### Regular usage

```tsx
import ref from '@vue/composition-api'
import Vue from 'vue'

// Setup.
const Example = defineComponent({
  setup () {
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

### Key

Due to the limitation, we have to use `v-bind:key`:

```tsx
<TransitionGroup>{
  userList.map(item => (
    <div v-bind:key={item.id}>{item.name}</div>
  ))
}</TransitionGroup>
```

### Transition / TransitionGroup

```tsx
import Vue from 'vue'

const Transition = Vue.component('Transition')
const TransitionGroup = Vue.component('TransitionGroup')

setup () {
  return () => (
    <div>
      <TransitionGroup>
        <div v-bind:key='key-1'>Some element</div>
        <div v-bind:key='key-2'>Some element</div>
      </TransitionGroup>
      <Transition>
        <div>Some element</div>
      </Transition>
    </div>
  )
}
```

or

```tsx
setup () {
  return () => (
    <div>
      <transition-group>
        <div v-bind:key='key-1'>Some element</div>
        <div v-bind:key='key-2'>Some element</div>
      </transition-group>
      <transition>
        <div>Some element</div>
      </transition>
    </div>
  )
}
```

## Compatibility

These format below are also available, but they are NOT recommended, just for compatibility.

### On

```tsx
<div v-on:click={onClick}></div>
<div vOn:click={onClick}></div>
```

### v-model

```tsx
<input vModel={userInpuptRef.value} />
```

### Key

```tsx
<div v-bind:key='key-1' />
<div vBind:key='key-1' />
```

## For Vite users

For Vite users, it's better to use TSC or SWC instead of built-in ESBuild. Because ESBuild is very finicky at handling JSX for now, and it gives you no room to change its behavior.

For faster compilation, SWC is recommended. You can use [unplugin-swc](https://github.com/egoist/unplugin-swc) to make Vite uses SWC.

Once you have switched to SWC (TSC) from ESBuild, you will not only be able to use JSX, but also get more features like `emitDecoratorMetadata` which is not supported by ESBuild, and the whole process is still darn fast.

### Configuration

After you have configured SWC (see Setup section above):

1. Install [unplugin-swc](https://github.com/egoist/unplugin-swc).

```
npm install unplugin-swc --save-dev
```

2. Update `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import swc from 'unplugin-swc'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  plugins: [
    swc.vite(),
    createVuePlugin(),
    ...
  ]
})
```

## Mixing usage

If you have to use `JSX` and `SFC` together in Vite, you need to update your Vite config:

```ts
import { defineConfig } from 'vite'
import swc from 'unplugin-swc'
import { createVuePlugin } from 'vite-plugin-vue2'

const swcPlugin = swc.vite()

export default defineConfig({
  plugins: [
    {
      ...swcPlugin,
      transform (code, id, ...args) {
        if (
          id.endsWith('.tsx') || id.endsWith('.ts') ||
          (id.includes('.vue') && id.includes('lang.ts'))
        ) {
          return swcPlugin.transform.call(this, code, id, ...args)
        }
      }
    },

    createVuePlugin(),
    ...
  ]
})
```

This will make SWC to skip compiling Non-Typescript codes in Vue SFC.

## Hot Reload

Use [vite-plugin-vue2-hmr](https://github.com/LancerComet/vite-plugin-vue2-hmr) to enable Vue2 JSX hot reload in Vite.

## Contributing

Feel free to open issue or pull request to make it better.

## References

 - [Introducing the New JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
 - [Render Function](https://vuejs.org/guide/extras/render-function.html)
 - [vue-jsx-runtime (Vue 3)](https://github.com/dolymood/vue-jsx-runtime)
 - [@vue/composition-api](https://github.com/vuejs/composition-api)
 - [@vue/babel-plugin-jsx](https://github.com/vuejs/babel-plugin-jsx)
