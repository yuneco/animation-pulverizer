import { HIT_CLASS, TARGET_CLASS } from './defs/consts'
import { scoreForElement } from './scoreForElement'
import { showHitEffect } from './showHitEffect'
import { isHTMLOrSvgElement } from './utils/isHTMLOrSvgElement'

export type ElState = 'target' | 'hit' | 'wait'

export const elState = (el: HTMLElement | SVGElement): ElState => {
  if (el.classList.contains(HIT_CLASS)) return 'hit'
  if (el.classList.contains(TARGET_CLASS)) return 'target'
  return 'wait'
}

export const changeElState = (el: HTMLElement | SVGElement, state: ElState) => {
  const current = elState(el)
  if (current === state) return
  if (state === 'hit') {
    if (current !== 'target') return
    makeHit(el)
  }
  if (state === 'target') {
    if (current !== 'wait') return
    makeTarget(el)
  }
  if (state === 'wait') {
    if (current !== 'target') return
    makeWait(el)
  }
}

const makeHit = (el: HTMLElement | SVGElement) => {
  el.classList.remove(TARGET_CLASS)
  el.classList.add(HIT_CLASS)
  showHitEffect(el, scoreForElement(el))
}

const makeTarget = (el: HTMLElement | SVGElement) => {
  el.classList.add(TARGET_CLASS)
  el.removeEventListener('click', onDirectClick)
  el.addEventListener('click', onDirectClick)
}

const makeWait = (el: HTMLElement | SVGElement) => {
  el.classList.remove(TARGET_CLASS)
  el.removeEventListener('click', onDirectClick)
}

const onDirectClick = (ev: Event) => {
  console.log('direct', ev)
  if (!isHTMLOrSvgElement(ev.target)) return
  changeElState(ev.target, 'hit')
  ev.preventDefault()
  ev.stopImmediatePropagation()
  ev.target.removeEventListener('click', onDirectClick)
}
