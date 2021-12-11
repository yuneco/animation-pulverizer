import { elState } from './changeElState'
import { IGNORE_CLASS } from './defs/consts'
import { diffArray } from './utils/diffArray'
import { isHTMLOrSvgElement } from './utils/isHTMLOrSvgElement'
import { ListChangeHandler } from './utils/ListChangedHandler'

type HTMLOrSVGElement = HTMLElement | SVGElement
const ANIM_PROP_NAMES = [
  'width',
  'height',
  'left',
  'top',
  'right',
  'bottom',
  'transform',
] as const
type AnimationPropName = typeof ANIM_PROP_NAMES[number]
type AnimationEntry = Readonly<{
  el: HTMLOrSVGElement
  expired: number
  isActive: boolean
  props: { [key in AnimationPropName]?: string }
}>

let entries: AnimationEntry[] = []
const LIVE_TIME_MS = 100

const getAnimationProps = (
  el: HTMLOrSVGElement
): AnimationEntry['props'] | undefined => {
  const ps = ANIM_PROP_NAMES.map((name) => [
    name,
    el.style[name]?.toString(),
  ]).filter((ent) => ent[1]) as [AnimationPropName, string][]
  if (!ps.length) return undefined
  return Object.fromEntries(ps) as { [key in AnimationPropName]: string }
}

const isPropChanged = (
  p1: AnimationEntry['props'],
  p2: AnimationEntry['props']
) => {
  return ANIM_PROP_NAMES.some((name) => p1[name] !== p2[name])
}

const createEntry = (
  el: HTMLOrSVGElement,
  old?: AnimationEntry
): AnimationEntry | undefined => {
  const props = getAnimationProps(el)
  if (!props) return
  if (old && !isPropChanged(props, old.props)) return
  return {
    el,
    isActive: !!old,
    expired: Date.now() + LIVE_TIME_MS,
    props,
  }
}

const getEntry = (el: HTMLOrSVGElement) => entries.find((ent) => ent.el === el)
const removeEntry = (el: HTMLOrSVGElement): AnimationEntry | undefined => {
  const index = entries.findIndex((ent) => ent.el === el)
  if (index === -1) return
  return entries.splice(index, 1)[0]
}

const onStyleChanged = (el: HTMLOrSVGElement) => {
  if (el.classList.contains(IGNORE_CLASS)) return
  const oldEnt = getEntry(el)
  const ent = createEntry(el, oldEnt)
  if (!ent) return
  removeEntry(el)
  if (elState(el) === 'hit') return
  if (ent) entries.push(ent)
}

const removeExpired = () => {
  const now = Date.now()
  entries = entries.filter((ent) => ent.expired > now)
}

const initStyleObserver = () => {
  const observer = new MutationObserver(function (mutations) {
    const els = mutations.map((rec) => rec.target).filter(isHTMLOrSvgElement)
    els.forEach(onStyleChanged)
  })
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ['style'],
  })
}

const getActiveElements = () => {
  return entries.filter((ent) => ent.isActive).map((ent) => ent.el)
}

export const watchTimerAnimatedElements = (
  onChange: ListChangeHandler<HTMLOrSVGElement>
) => {
  let lastElems: HTMLOrSVGElement[] = []
  initStyleObserver()
  const onTick = () => {
    removeExpired()
    const elems = getActiveElements()
    const { added, removed } = diffArray(lastElems, elems)
    if (added.length || removed.length) {
      try {
        onChange(added, removed, elems)
      } catch (err) {
        console.warn(err)
      }
      lastElems = [...elems]
    }
    requestAnimationFrame(onTick)
  }
  onTick()
}
