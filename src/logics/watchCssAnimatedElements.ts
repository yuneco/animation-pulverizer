import { isHTMLOrSvgElement } from "./isHTMLOrSvgElement"
import { ListChangeHandler } from "./ListChangedHandler"

type AnimationEntry = {
  el: HTMLElement | SVGElement,
  prop: string,
  type: 'transition' | 'animation'
}

const isIgnoreEvent = (ev: TransitionEvent) => ev.propertyName.includes('outline')

const entries: AnimationEntry[] = []
export const watchCssAnimatedElements = (onChanged: ListChangeHandler<HTMLElement | SVGElement>) => {

  const onstartTransition = (ev: TransitionEvent): AnimationEntry | undefined => {
    if (!isHTMLOrSvgElement(ev.target)) return
    if (isIgnoreEvent(ev)) return
    const ent = {
      el: ev.target,
      prop: ev.propertyName,
      type: 'transition'
    } as const
    entries.push(ent)
    // console.log('transition start', entries)
    return ent
  }

  const onstartAnimation = (ev: AnimationEvent): AnimationEntry | undefined => {
    if (!isHTMLOrSvgElement(ev.target)) return
    const ent = {
      el: ev.target,
      prop: ev.animationName,
      type: 'animation'
    } as const
    entries.push(ent)
    // console.log('animation start', ent)
    return ent
  }

  const onstart = (ev: TransitionEvent | AnimationEvent) => {
    const added = ev instanceof TransitionEvent ? onstartTransition(ev) : onstartAnimation(ev)
    if (!added) return
    onChanged([added.el], [], entries.map(ent => ent.el))
  }

  const onend = (ev: TransitionEvent | AnimationEvent) => {
    const type = ev instanceof TransitionEvent ? 'transition' : 'animation'
    const prop = ev instanceof TransitionEvent ? ev.propertyName : ev.animationName
    if (ev instanceof TransitionEvent && isIgnoreEvent(ev)) return
    const index = entries.findIndex(ent => ent.el === ev.target && ent.prop === prop && ent.type === type)
    if (index === -1) return
    const removed = entries.splice(index, 1)[0]
    if (!removed) return
    onChanged([], [removed.el], entries.map(ent => ent.el))
  }

  document.body.addEventListener('transitionstart', onstart)
  document.body.addEventListener('transitionend', onend)
  document.body.addEventListener('animationstart', onstart)
  document.body.addEventListener('animationend', onend)

}