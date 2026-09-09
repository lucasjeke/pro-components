import type { ControlPosition, MouseTouchEvent, PositionOffsetControlPosition } from '../types'
import browserPrefix, { browserPrefixToKey } from './getPrefix'
import { findInArray, int, isFunction } from './shims'

interface Indexable { [key: string]: unknown }

type EventListenerLike = (event: never) => void | false

let matchesSelectorFunc = ''
const userSelectStates = new WeakMap<Document, {
  count: number
  existed: boolean
}>()

export function matchesSelector(el: Node, selector: string): boolean {
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = findInArray([
      'matches',
      'webkitMatchesSelector',
      'mozMatchesSelector',
      'msMatchesSelector',
      'oMatchesSelector',
    ], (method) => {
      // Doesn't think elements are indexable
      return isFunction((el as unknown as Indexable)[method])
    }) ?? ''
  }

  // Might not be found entirely (not an Element?) - in that case, bail
  // Doesn't think elements are indexable
  const matchFn = (el as unknown as Indexable)[matchesSelectorFunc]
  if (!isFunction(matchFn))
    return false

  // Doesn't think elements are indexable
  return Boolean(matchFn.call(el, selector))
}

export function matchesSelectorAndParentsTo(el: Node, selector: string, baseNode: Node): boolean {
  let node: Node | null = el
  do {
    if (matchesSelector(node, selector))
      return true
    if (node === baseNode)
      return false
    node = node.parentNode
  } while (node)

  return false
}

export function addEvent(
  el: Node | null | undefined,
  event: string,
  handler: EventListenerLike,
  inputOptions?: AddEventListenerOptions,
): void {
  if (!el)
    return
  const options = { capture: true, ...inputOptions }
  const listener = handler as EventListener
  if (el.addEventListener) {
    el.addEventListener(event, listener, options)
  }
  else if ((el as unknown as Indexable).attachEvent) {
    (el as unknown as { attachEvent: (name: string, handler: EventListener) => void }).attachEvent(`on${event}`, listener)
  }
  else {
    // Doesn't think elements are indexable
    (el as unknown as Indexable)[`on${event}`] = listener
  }
}

export function removeEvent(
  el: Node | null | undefined,
  event: string,
  handler: EventListenerLike,
  inputOptions?: AddEventListenerOptions,
): void {
  if (!el)
    return
  const options = { capture: true, ...inputOptions }
  const listener = handler as EventListener
  if (el.removeEventListener) {
    el.removeEventListener(event, listener, options)
  }
  else if ((el as unknown as Indexable).detachEvent) {
    (el as unknown as { detachEvent: (name: string, handler: EventListener) => void }).detachEvent(`on${event}`, listener)
  }
  else {
    // Doesn't think elements are indexable
    (el as unknown as Indexable)[`on${event}`] = null
  }
}

export function outerHeight(node: HTMLElement): number {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  let height = node.clientHeight
  const computedStyle = (node.ownerDocument.defaultView as Window).getComputedStyle(node)
  height += int(computedStyle.borderTopWidth)
  height += int(computedStyle.borderBottomWidth)
  return height
}

export function outerWidth(node: HTMLElement): number {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetLeft which is including margin. See getBoundPosition
  let width = node.clientWidth
  const computedStyle = (node.ownerDocument.defaultView as Window).getComputedStyle(node)
  width += int(computedStyle.borderLeftWidth)
  width += int(computedStyle.borderRightWidth)
  return width
}
export function innerHeight(node: HTMLElement): number {
  let height = node.clientHeight
  const computedStyle = (node.ownerDocument.defaultView as Window).getComputedStyle(node)
  height -= int(computedStyle.paddingTop)
  height -= int(computedStyle.paddingBottom)
  return height
}

export function innerWidth(node: HTMLElement): number {
  let width = node.clientWidth
  const computedStyle = (node.ownerDocument.defaultView as Window).getComputedStyle(node)
  width -= int(computedStyle.paddingLeft)
  width -= int(computedStyle.paddingRight)
  return width
}

interface EventWithOffset {
  clientX: number
  clientY: number
}

// Get from offsetParent
export function offsetXYFromParent(evt: EventWithOffset, offsetParent: HTMLElement, scale: number): ControlPosition {
  const isBody = offsetParent === offsetParent.ownerDocument.body
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect()

  const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale
  const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale

  return { x, y }
}

export function createCSSTransform(controlPos: ControlPosition, positionOffset: PositionOffsetControlPosition): { [key: string]: string } {
  const translation = getTranslation(controlPos, positionOffset, 'px')
  return { [browserPrefixToKey('transform', browserPrefix)]: translation }
}

export function createSVGTransform(controlPos: ControlPosition, positionOffset: PositionOffsetControlPosition): string {
  const translation = getTranslation(controlPos, positionOffset, '')
  return translation
}
export function getTranslation({ x, y }: ControlPosition, positionOffset: PositionOffsetControlPosition, unitSuffix: string): string {
  let translation = `translate(${x}${unitSuffix},${y}${unitSuffix})`
  if (positionOffset) {
    const defaultX = `${(typeof positionOffset.x === 'string') ? positionOffset.x : positionOffset.x + unitSuffix}`
    const defaultY = `${(typeof positionOffset.y === 'string') ? positionOffset.y : positionOffset.y + unitSuffix}`
    translation = `translate(${defaultX}, ${defaultY})${translation}`
  }
  return translation
}

export function getTouch(e: MouseTouchEvent, identifier: number): { clientX: number, clientY: number } | null | undefined {
  if (!('targetTouches' in e))
    return null
  return (e.targetTouches && findInArray(e.targetTouches, touch => identifier === touch.identifier))
    || (e.changedTouches && findInArray(e.changedTouches, touch => identifier === touch.identifier))
}

export function getTouchIdentifier(e: MouseTouchEvent): number | undefined {
  if (!('targetTouches' in e))
    return undefined
  if (e.targetTouches && e.targetTouches[0])
    return e.targetTouches[0].identifier
  if (e.changedTouches && e.changedTouches[0])
    return e.changedTouches[0].identifier
}

export function addUserSelectStyles(doc: Document | null | undefined) {
  if (!doc)
    return
  let styleEl = doc.getElementById('vue-draggable-style-el') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = doc.createElement('style')
    styleEl.id = 'vue-draggable-style-el'
    styleEl.textContent = `.vue-draggable-transparent-selection *::-moz-selection {all: inherit;}\n.vue-draggable-transparent-selection *::selection {all: inherit;}\n`
    // styleEl.innerHTML = '.vue-draggable-transparent-selection *::-moz-selection {all: inherit;}\n'
    // styleEl.innerHTML += '.vue-draggable-transparent-selection *::selection {all: inherit;}\n'
    doc.getElementsByTagName('head')[0]!.appendChild(styleEl)
  }
  if (doc.body) {
    const state = userSelectStates.get(doc) ?? {
      count: 0,
      existed: doc.body.classList.contains('vue-draggable-transparent-selection'),
    }
    state.count += 1
    userSelectStates.set(doc, state)
    addClassName(doc.body, 'vue-draggable-transparent-selection')
  }
}

export function scheduleRemoveUserSelectStyles(doc: Document | null | undefined) {
  if (!doc)
    return
  const state = userSelectStates.get(doc)
  if (!state)
    return

  state.count = Math.max(0, state.count - 1)
  if (state.count > 0)
    return

  userSelectStates.delete(doc)
  const removeClass = !state.existed
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(() => {
      removeUserSelectStyles(doc, removeClass)
    })
  }
  else {
    removeUserSelectStyles(doc, removeClass)
  }
}

function removeUserSelectStyles(doc: Document | null | undefined, removeClass: boolean) {
  if (!doc)
    return
  try {
    if (doc.body && removeClass)
      removeClassName(doc.body, 'vue-draggable-transparent-selection')
    // IE
    const ieSelection = (doc as unknown as { selection?: { empty: () => void } }).selection
    if (ieSelection) {
      // IE
      ieSelection.empty()
    }
    else {
      // Remove selection caused by scroll, unless it's a focused input
      // (we use doc.defaultView in case we're in an iframe)
      const selection = (doc.defaultView || window).getSelection()
      if (selection && selection.type !== 'Caret') {
        selection.removeAllRanges()
      }
    }
  }
  catch {
    // probably IE
  }
}

export function addClassName(el: HTMLElement, className: string) {
  if (el.classList) {
    el.classList.add(className)
  }
  else {
    if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
      el.className += ` ${className}`
    }
  }
}

export function removeClassName(el: HTMLElement, className: string) {
  if (el.classList) {
    el.classList.remove(className)
  }
  else {
    el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '')
  }
}
