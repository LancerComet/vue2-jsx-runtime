/* eslint-disable no-undef */

import {
  checkIsHTMLElement, removeNativeOn, removeOn,
  getValueFromObject
} from '../lib/utils'

it('checkIsHTMLElement.', () => {
  const htmlTagList = [
    'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio',
    'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button',
    'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup',
    'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt',
    'em', 'embed',
    'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html',
    'i', 'iframe', 'img', 'input', 'ins',
    'kbd',
    'label', 'legend', 'li', 'link',
    'main', 'map', 'mark', 'meta', 'meter',
    'nav', 'noframes', 'noscript',
    'object', 'ol', 'optgroup', 'option', 'output',
    'p', 'param', 'picture', 'pre', 'progress',
    'q',
    'rp', 'rt', 'ruby',
    's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg',
    'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt',
    'u', 'ul',
    'var', 'video',
    'wbr'
  ]
  htmlTagList.forEach(item => {
    expect(checkIsHTMLElement(item)).toBe(true)
  })
})

it('removeOn.', () => {
  expect(removeOn('onClick')).toBe('click')
  expect(removeOn('onClipboardData')).toBe('clipboardData')
  expect(removeOn('click')).toBe('click')
  expect(removeOn('Click')).toBe('click')
  expect(removeOn('on-something-went-wrong')).toBe('somethingWentWrong')
  expect(removeOn('on_something-wentWrong_again')).toBe('somethingWentWrongAgain')
})

it('removeNativeOn', () => {
  expect(removeNativeOn('onClick:native')).toBe('click')
  expect(removeNativeOn('click')).toBe('click')
  expect(removeNativeOn('onClick')).toBe('click')
  expect(removeNativeOn('click:native')).toBe('click')
  expect(removeNativeOn('Click:native')).toBe('click')
  expect(removeNativeOn('onClipboardData:native')).toBe('clipboardData')
  expect(removeNativeOn('on-something-went-wrong:native')).toBe('somethingWentWrong')
  expect(removeNativeOn('on_something-wentWrong_again:native')).toBe('somethingWentWrongAgain')
})

it('getValueFromObject.', () => {
  expect(getValueFromObject({ a: 1 }, 'a')).toBe(1)
  expect(getValueFromObject({ a: 1, b: 2, c: { d: 3 } }, 'c.d')).toBe(3)
  expect(getValueFromObject({}, 'a.b.c.d')).toBe(undefined)
})
