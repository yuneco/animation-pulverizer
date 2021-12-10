export const elementsFromPoint = (
  x: number,
  y: number
): (HTMLElement | SVGElement)[] => {
  const rollbackList: {
    el: HTMLElement | SVGElement
    pointerEvents: string
  }[] = []
  const results: (HTMLElement | SVGElement)[] = []

  let current: Element | null = document.elementFromPoint(x, y)
  while (current) {
    if (current.tagName.toLowerCase() === 'html') break
    if (!(current instanceof HTMLElement || current instanceof SVGElement)) {
      break
    }
    results.push(current)
    rollbackList.push({
      el: current,
      pointerEvents: current.style.pointerEvents,
    })
    current.style.pointerEvents = 'none'
    current = document.elementFromPoint(x, y)
  }

  rollbackList.forEach(ent => (ent.el.style.pointerEvents = ent.pointerEvents))

  console.log(results)
  return results
}
