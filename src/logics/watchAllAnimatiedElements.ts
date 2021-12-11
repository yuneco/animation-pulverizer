import { AnimatableElement } from './defs/AnimatableElement'
import { ListChangeHandler } from './utils/ListChangedHandler'
import { watchCssAnimatedElements } from './watchCssAnimatedElements'
import { watchTimerAnimatedElements } from './watchTimerAnimatedElements'

let allCss: AnimatableElement[] = []
let allTimer: AnimatableElement[] = []

export const watchAllAnimatiedElements = (
  onChange: ListChangeHandler<AnimatableElement>
) => {
  watchCssAnimatedElements((added, removed, all) => {
    allCss = [...all]
    onChange(added, removed, [...allCss, ...allTimer])
  })
  watchTimerAnimatedElements((added, removed, all) => {
    allTimer = [...all.map((el) => ({ el, pseudo: '' }))]
    onChange(
      added.map((el) => ({ el, pseudo: '' })),
      removed.map((el) => ({ el, pseudo: '' })),
      [...allCss, ...allTimer]
    )
  })
}
