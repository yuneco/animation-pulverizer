import { NOISE_FILTER_ID } from "./consts"

const svgText = (id: string) => `
<filter id='${id}' x='0%' y='0%' width='110%' height='110%'>
  <feTurbulence type="turbulence" baseFrequency="0.2 0.2" result="NOISE" numOctaves="2" />
  <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="8" xChannelSelector="R" yChannelSelector="R"></feDisplacementMap>
</filter>
`

export const initSvgFilter = () => {
  const NS = 'http://www.w3.org/2000/svg'
  const el = document.createElementNS(NS, 'svg')
  el.innerHTML = svgText(NOISE_FILTER_ID)
  document.body.appendChild(el)
}
