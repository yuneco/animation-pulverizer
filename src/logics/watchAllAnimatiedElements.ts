import { ListChangeHandler } from "./ListChangedHandler"
import { watchCssAnimatedElements } from "./watchCssAnimatedElements"
import { watchTimerAnimatedElements } from "./watchTimerAnimatedElements"

export const watchAllAnimatiedElements = (onChange: ListChangeHandler<HTMLElement | SVGElement>) => {
  watchCssAnimatedElements(onChange)
  watchTimerAnimatedElements(onChange)
}
