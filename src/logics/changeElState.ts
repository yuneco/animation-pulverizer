import { HIT_CLASS, NOISE_FILTER_ID, TARGET_CLASS } from "./consts"
import { isHTMLOrSvgElement } from "./isHTMLOrSvgElement"

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
  el.animate([
    { opacity: el.style.opacity, transform: 'scale(0.8)', filter: `blur(0) url('#${NOISE_FILTER_ID}')` },
    { opacity: 0, transform: 'scale(1.5)', filter: `blur(10px) url('#${NOISE_FILTER_ID}')` },
  ],
  {
    fill: 'forwards',
    duration: 500
  })
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

