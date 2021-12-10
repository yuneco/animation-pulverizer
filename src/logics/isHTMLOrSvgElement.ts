export const isHTMLOrSvgElement = (
  node: unknown
): node is HTMLElement | SVGElement => node instanceof HTMLElement || node instanceof SVGElement
