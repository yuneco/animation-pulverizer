const isCSSKeyframesRule = (rule: CSSRule): rule is CSSKeyframesRule => {
  return rule instanceof CSSKeyframesRule
}
const isCSSKeyframeRule = (rule: CSSRule): rule is CSSKeyframeRule => {
  return rule instanceof CSSKeyframeRule
}

const getAnimations = () => {
  const rules = Array.from(document.styleSheets).flatMap(s => Array.from(s.cssRules))
  const anims = rules.filter(isCSSKeyframesRule)
  const defs = anims.map(anim => {
    const name = anim.name
    const props = Array.from(anim.cssRules).filter(isCSSKeyframeRule).flatMap(rule => Array.from(rule.style))
    return {name, props}
  })
  return defs
}

const defs = getAnimations()
