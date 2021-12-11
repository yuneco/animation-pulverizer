/** 「アニメーションに使用するスタイル」として変更を監視するプロパティの一覧 */
export const ANIM_PROP_NAMES = [
  'width',
  'height',
  'left',
  'top',
  'right',
  'bottom',
  'transform',
] as const

/** アニメーションに使用するCSSのプロパティ名 */
export type AnimationPropName = typeof ANIM_PROP_NAMES[number]
