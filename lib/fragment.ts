const freeze = (object, property, value) => {
  Object.defineProperty(object, property, {
    configurable: true,
    get () { return value },
    set (v) { console.warn(`tried to set frozen property ${property} with ${v}`) }
  })
}

const Fragment = {
  abstract: true,
  name: 'Fragment',

  props: {
    html: {
      type: String,
      default: null
    }
  },

  mounted () {
    const container = this.$el
    const parent = container.parentNode

    container.__isFragment = true
    container.__isMounted = false

    const head = document.createComment('fragment#head')
    const tail = document.createComment('fragment#tail')

    container.__head = head
    container.__tail = tail

    // use document fragment to improve efficiency
    const tpl = document.createDocumentFragment()
    tpl.appendChild(head)

    Array.from(container.childNodes)
      .forEach(node => {
        // container.appendChild(node, true)
        // eslint-disable-next-line no-prototype-builtins
        const notFrChild = !node.hasOwnProperty('__isFragmentChild__')
        // @ts-ignore
        tpl.appendChild(node)
        if (notFrChild) {
          freeze(node, 'parentNode', container)
          freeze(node, '__isFragmentChild__', true)
        }
      })

    tpl.appendChild(tail)

    // embed html
    if (this.html) {
      const template = document.createElement('template')
      template.innerHTML = this.html
      // copy elements over
      Array.from(template.content.childNodes).forEach(node => {
        tpl.appendChild(node)
      })
    }

    const next = container.nextSibling
    parent.insertBefore(tpl, container, true)
    parent.removeChild(container)
    freeze(container, 'parentNode', parent)
    freeze(container, 'nextSibling', next)
    if (next) { freeze(next, 'previousSibling', container) }

    container.__isMounted = true
  },

  render (h) {
    const children = this.$slots.default

    // add fragment attribute on the children
    if (children && children.length) {
      // eslint-disable-next-line no-return-assign
      children.forEach(child =>
        child.data = { ...child.data, attrs: { ...(child.data || {}).attrs } }
      )
    }

    return h(
      'div',
      { attrs: { fragment: this.name } },
      children
    )
  }
}

export {
  Fragment
}
