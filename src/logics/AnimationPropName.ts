export const ANIM_PROP_NAMES = [
  'width',
  'height',
  'left',
  'top',
  'right',
  'bottom',
  'transform',
] as const
export type AnimationPropName = typeof ANIM_PROP_NAMES[number]
