/* eslint-disable no-undef */

import { defineComponent } from '@vue/composition-api'
import { shallowMount } from '@vue/test-utils'

describe('HTML testing.', () => {
  it('Separated event should work.', (done) => {
    let isClicked = false
    let isContextMenuTriggered = false

    const Example = defineComponent({
      setup () {
        const onClick = () => {
          isClicked = true
          isClicked && isContextMenuTriggered && done()
        }

        const onContextMenu = () => {
          isContextMenuTriggered = true
          isClicked && isContextMenuTriggered && done()
        }

        return () => (
          <button class='btn' onClick={onClick} onContextmenu={onContextMenu}></button>
        )
      }
    })

    const wrapper = shallowMount(Example)
    const btn = wrapper.find('button.btn')

    btn.trigger('click')
    btn.trigger('contextmenu')
  })

  it('On object event should work.', (done) => {
    let isClicked = false
    let isContextMenuTriggered = false

    const Example = defineComponent({
      setup () {
        const onClick = () => {
          isClicked = true
          isClicked && isContextMenuTriggered && done()
        }

        const onContextMenu = () => {
          isContextMenuTriggered = true
          isClicked && isContextMenuTriggered && done()
        }

        return () => (
          <button
            class='btn'
            on={{
              click: onClick,
              contextmenu: onContextMenu
            }}
          ></button>
        )
      }
    })

    const wrapper = shallowMount(Example)
    const btn = wrapper.find('button.btn')

    btn.trigger('click')
    btn.trigger('contextmenu')
  })

  it('Mixin events should work.', (done) => {
    let isClicked = false
    let isContextMenuTriggered = false

    const Example = defineComponent({
      setup () {
        const onClick = () => {
          isClicked = true
          isClicked && isContextMenuTriggered && done()
        }

        const onContextMenu = () => {
          isContextMenuTriggered = true
          isClicked && isContextMenuTriggered && done()
        }

        return () => (
          <button
            class='btn'
            on={{
              contextmenu: onContextMenu
            }}
            onClick={onClick}
          ></button>
        )
      }
    })

    const wrapper = shallowMount(Example)
    const btn = wrapper.find('button.btn')

    btn.trigger('click')
    btn.trigger('contextmenu')
  })
})

describe('Vue Component testing.', () => {
  it('Separated event should work.', (done) => {
    let isClicked = false
    let isContextMenuTriggered = false

    const Example = defineComponent({
      emits: ['click', 'contextMenu'],
      setup (_, { emit }) {
        const onClick = () => {
          emit('click')
        }

        const onContextMenu = () => {
          emit('contextMenu')
        }

        return () => (
          <button class='btn' onClick={onClick} onContextmenu={onContextMenu}></button>
        )
      }
    })

    const Wrapper = defineComponent({
      setup () {
        const onClick = () => {
          isClicked = true
          isClicked && isContextMenuTriggered && done()
        }

        const onContextMenu = () => {
          isContextMenuTriggered = true
          isClicked && isContextMenuTriggered && done()
        }

        return () => (
          <Example onClick={onClick} onContextMenu={onContextMenu} />
        )
      }
    })

    const wrapper = shallowMount(Wrapper)
    const btn = wrapper.find('button.btn')

    btn.trigger('click')
    btn.trigger('contextmenu')
  })

  it('On object event should work.', (done) => {
    let isClicked = false
    let isContextMenuTriggered = false

    const Example = defineComponent({
      emits: ['click', 'contextMenu'],
      setup (_, { emit }) {
        const onClick = () => {
          emit('click')
        }

        const onContextMenu = () => {
          emit('contextMenu')
        }

        return () => (
          <button class='btn' onClick={onClick} onContextmenu={onContextMenu}></button>
        )
      }
    })

    const Wrapper = defineComponent({
      setup () {
        const onClick = () => {
          isClicked = true
          isClicked && isContextMenuTriggered && done()
        }

        const onContextMenu = () => {
          isContextMenuTriggered = true
          isClicked && isContextMenuTriggered && done()
        }

        return () => (
          <Example on={{
            click: onClick,
            contextMenu: onContextMenu
          }} />
        )
      }
    })

    const wrapper = shallowMount(Wrapper)
    const btn = wrapper.find('button.btn')

    btn.trigger('click')
    btn.trigger('contextmenu')
  })

  it('Mixin events should work.', (done) => {
    let isClicked = false
    let isContextMenuTriggered = false

    const Example = defineComponent({
      emits: ['click', 'contextMenu'],
      setup (_, { emit }) {
        const onClick = () => {
          emit('click')
        }

        const onContextMenu = () => {
          emit('contextMenu')
        }

        return () => (
          <button class='btn' onClick={onClick} onContextmenu={onContextMenu}></button>
        )
      }
    })

    const Wrapper = defineComponent({
      setup () {
        const onClick = () => {
          isClicked = true
          isClicked && isContextMenuTriggered && done()
        }

        const onContextMenu = () => {
          isContextMenuTriggered = true
          isClicked && isContextMenuTriggered && done()
        }

        return () => (
          <Example on={{ click: onClick }} onContextMenu={onContextMenu} />
        )
      }
    })

    const wrapper = shallowMount(Wrapper)
    const btn = wrapper.find('button.btn')

    btn.trigger('click')
    btn.trigger('contextmenu')
  })
})
