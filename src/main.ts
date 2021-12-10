import { elementsFromPoint } from './logics/elementsFromPoint'
import { watchAllAnimatiedElements } from './logics/watchAllAnimatiedElements'
import './style.css'

const TARGET_CLASS = 'animatedClickTarget'

const main = () => {
  let movingElems: (HTMLElement | SVGElement)[] = []

  watchAllAnimatiedElements((added, removed, all) => {
    movingElems = [...all]
    added.map(el => {
      el.classList.add(TARGET_CLASS)
    })
    removed.map(el => {
      el.classList.remove(TARGET_CLASS)
    })
  })

  document.body.addEventListener('pointerdown', (ev) => {
    const els = elementsFromPoint(ev.clientX, ev.clientY).filter(el => movingElems.includes(el))
    els.forEach(el => {
      el.style.outline = '2px solid blue'
      el.animate([
        { opacity: el.style.opacity, transform: 'scale(1)', filter: 'blur(0)' },
        { opacity: 0, transform: 'scale(1.3)', filter: 'blur(10px)' },
      ],
      {
        fill: 'forwards',
        duration: 2000
      })
    })    
  })
}

chrome.runtime.onMessage.addListener((message: { action: string }) => {
  if (message.action === 'activate') main()
})
