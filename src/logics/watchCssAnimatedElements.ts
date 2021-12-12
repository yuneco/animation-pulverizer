import { AnimatableElement } from './defs/AnimatableElement'
import { ANIM_PROP_NAMES } from './defs/AnimationPropName'
import { elState } from './changeElState'
import { isHTMLOrSvgElement } from './utils/isHTMLOrSvgElement'
import { ListChangeHandler } from './utils/ListChangedHandler'
import { IGNORE_CLASS } from './defs/consts'

type AnimationEntry = {
  element: AnimatableElement
  prop: string
  type: 'transition' | 'animation'
}

const shouldIgnoreTransition = (ev: TransitionEvent | AnimationEvent) => {
  if (!isHTMLOrSvgElement(ev.target)) return true
  if (ev.target.classList.contains(IGNORE_CLASS)) return true
  if (ev instanceof TransitionEvent) {
    if (!(ANIM_PROP_NAMES as readonly string[]).includes(ev.propertyName)) return true
  }
  return false
}

const entries: AnimationEntry[] = []

const createEntry = (
  ev: TransitionEvent | AnimationEvent
): AnimationEntry | undefined => {
  if (!isHTMLOrSvgElement(ev.target)) return
  return {
    element: { el: ev.target, pseudo: ev.pseudoElement },
    prop: ev instanceof TransitionEvent ? ev.propertyName : ev.animationName,
    type: ev instanceof TransitionEvent ? 'transition' : 'animation',
  }
}

const isSameEntry = (e1: AnimationEntry, e2: AnimationEntry) =>
  e1.element.el === e2.element.el &&
  e1.element.pseudo === e2.element.pseudo &&
  e1.prop === e2.prop &&
  e1.type === e2.type

export const watchCssAnimatedElements = (
  onChanged: ListChangeHandler<AnimatableElement>
) => {
  const onstart = (ev: TransitionEvent | AnimationEvent) => {
    if (!isHTMLOrSvgElement(ev.target)) return
    if (shouldIgnoreTransition(ev)) return
    if (elState(ev.target) !== 'wait') return
    const ent = createEntry(ev)
    if (!ent) return
    entries.push(ent)
    onChanged(
      [ent.element],
      [],
      entries.map((ent) => ent.element)
    )
  }

  const onend = (ev: TransitionEvent | AnimationEvent) => {
    if (ev instanceof TransitionEvent && shouldIgnoreTransition(ev)) return
    const entEnd = createEntry(ev)
    if (!entEnd) return
    const index = entries.findIndex((ent) => isSameEntry(ent, entEnd))
    if (index === -1) return
    const removed = entries.splice(index, 1)[0]
    if (!removed) return
    onChanged(
      [],
      [removed.element],
      entries.map((ent) => ent.element)
    )
  }

  document.body.addEventListener('transitionstart', onstart)
  document.body.addEventListener('transitionend', onend)
  document.body.addEventListener('animationstart', onstart)
  document.body.addEventListener('animationend', onend)
}
