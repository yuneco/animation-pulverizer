/** 要素のサイズに基づき、適当なスコアを計算して返します */
export const scoreForElement = (el: Element) => {
  const SCORE_UNIT = 10
  const elRect = el.getBoundingClientRect()
  const areaRatio = (elRect.width * elRect.height) / (window.innerWidth * window.innerHeight)
  return Math.max(1, Math.round((1 / areaRatio) * SCORE_UNIT))
}
