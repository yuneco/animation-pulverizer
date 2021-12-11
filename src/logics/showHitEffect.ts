import { IGNORE_CLASS, NOISE_FILTER_ID, SCORE_LABEL_CLASS } from "./defs/consts"

const showScoreLabel = (el: HTMLElement | SVGElement, score: number) => {
  const label = document.createElement('div')
  label.textContent = `+${score}pt`
  label.classList.add(IGNORE_CLASS, SCORE_LABEL_CLASS)

  const elPos = el.getBoundingClientRect()
  label.style.left = `${elPos.x}px`
  label.style.top = `${elPos.y - 80}px`
  label.style.width = `${elPos.width}px`
  document.body.appendChild(label)

  setTimeout(() => {
    document.body.removeChild(label)
  }, 2000)
}

export const showHitEffect = (el: HTMLElement | SVGElement, score = 100) => {
  el.animate(
    [
      {
        opacity: el.style.opacity,
        transform: 'scale(0.8)',
        filter: `blur(0) url('#${NOISE_FILTER_ID}')`,
      },
      {
        opacity: 0,
        transform: 'scale(1.5)',
        filter: `blur(10px) url('#${NOISE_FILTER_ID}')`,
      },
    ],
    {
      fill: 'forwards',
      duration: 500,
    }
  )
  showScoreLabel(el, score)
}