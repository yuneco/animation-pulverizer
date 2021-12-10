import { watchCssAnimatedElements } from './logics/watchCssAnimatedElements'

const main = () => {
  watchCssAnimatedElements((added, removed, all) => {
    added.map(el => {
      el.style.outline = '2px solid red'
    })
    removed.map(el => {
      el.style.outline = ''
    })
  })
}

chrome.runtime.onMessage.addListener((message: { action: string }) => {
  if (message.action === 'activate') main()
})
