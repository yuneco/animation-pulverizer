import { initApp } from './app'

chrome.runtime.onMessage.addListener((message: { action: string }) => {
  if (message.action === 'activate') initApp()
})
