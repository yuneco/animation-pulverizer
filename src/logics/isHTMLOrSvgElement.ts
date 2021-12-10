export const isHTMLOrSvgElement = (
  node: unknown
): node is HTMLElement | SVGAElement => node instanceof HTMLElement || node instanceof SVGElement
