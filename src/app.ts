import { AnimatableElement } from './logics/defs/AnimatableElement'
import { elementsFromPoint } from './logics/elementsFromPoint'
import { changeElState, } from './logics/changeElState'
import { watchAllAnimatiedElements } from './logics/watchAllAnimatiedElements'
import './style.css'
import { initSvgFilter } from './logics/initSvgFilter'

let isActivated = false

export const initApp = () => {
  if (isActivated) return
  isActivated = true
  console.log('🔫GAME START!')
  initSvgFilter()
  let movingElems: AnimatableElement[] = []

  watchAllAnimatiedElements((added, removed, all) => {
    movingElems = [...all]
    added.map(element => {
      changeElState(element.el, 'target')
    })
    removed.map(element => {
      changeElState(element.el, 'wait')
    })
  })

  document.body.addEventListener('pointerdown', (ev) => {
    const elsAtPoint = elementsFromPoint(ev.clientX, ev.clientY)
    const elsMoving = movingElems.map(element => element.el)
    const els = elsAtPoint.filter(el => elsMoving.includes(el))
    els.forEach(el => changeElState(el, 'hit'))
    if (els.length) {
      ev.preventDefault()
      ev.cancelBubble = true
    }   
  })
}