import { diffArray } from "./diffArray";
import { isHTMLOrSvgElement } from "./isHTMLOrSvgElement";
import { ListChangeHandler } from "./ListChangedHandler";

type AnimatableElement = HTMLElement | SVGElement
const ANIM_PROP_NAMES = [
  "width",
  "height",
  "left",
  "top",
  "right",
  "bottom",
  "transform",
] as const;
type AnimationPropName = typeof ANIM_PROP_NAMES[number];
type AnimationEntry = Readonly<{
  el: AnimatableElement;
  expired: number;
  isActive: boolean;
  props: { [key in AnimationPropName]?: string };
}>;

let entries: AnimationEntry[] = [];
const LIVE_TIME_MS = 100;

const getAnimationProps = (el: AnimatableElement): AnimationEntry['props'] | undefined => {
  const ps = ANIM_PROP_NAMES.map((name) => [
    name,
    el.style[name]?.toString(),
  ]).filter((ent) => ent[1]) as [AnimationPropName, string][];
  if (!ps.length) return undefined;
  return Object.fromEntries(ps) as { [key in AnimationPropName]: string };
};

const createEntry = (el: AnimatableElement, isActive: boolean): AnimationEntry | undefined => {
  const props = getAnimationProps(el)
  if (!props) return undefined
  return {
    el,
    isActive,
    expired: Date.now() + LIVE_TIME_MS,
    props,
  };
};

const getEntry = (el: AnimatableElement) => entries.find((ent) => ent.el === el);
const removeEntry = (el: AnimatableElement): AnimationEntry | undefined => {
  const index = entries.findIndex(ent => ent.el === el)
  if (index === -1) return
  return entries.splice(index, 1)[0]
}

const onStyleChanged = (el: AnimatableElement) => {
  const props = getAnimationProps(el)
  if (!props) return // No animation props
  const oldEnt = !!getEntry(el)
  removeEntry(el)
  const ent = createEntry(el, !!oldEnt)
  if (ent) entries.push(ent)
};

const removeExpired = () => {
  const now = Date.now()
  entries = entries.filter(ent => ent.expired > now)
}

const initStyleObserver = () => {
  const observer = new MutationObserver(function(mutations) {
    const els = mutations.map((rec) => rec.target).filter(isHTMLOrSvgElement);
    els.forEach((el) => {
      onStyleChanged(el)
    });
  });
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["style"],
  });
};

const getActiveElements = () => {
  return entries.filter(ent => ent.isActive).map(ent => ent.el)
}

export const watchTimerAnimatedElements = (onChange: ListChangeHandler<AnimatableElement>) => {
  let lastElems: AnimatableElement[] = []
  initStyleObserver()
  const onTick = () => {
    removeExpired()
    const elems = getActiveElements()
    const {added, removed} = diffArray(lastElems, elems)
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
};
