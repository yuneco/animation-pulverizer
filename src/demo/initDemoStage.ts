import { isHTMLOrSvgElement } from '../logics/utils/isHTMLOrSvgElement'
import { notNull } from '../logics/utils/notNull'
import './demo.scss'

const CARD_COUNT = 10
const TEMPLATE_CARD_SELECTOR = '.template .card'
const STAGE_SELECTOR = '#app > .stage'
const IMG_SRC = 'https://picsum.photos/seed/{seed}/300/200'
const LIST_CHILD_MAX = 4
const ANIM_CLASSES = ['slide-toR', 'slide-toL', 'slide-toT', 'pop']

/** 配列からひとつランダムに選びます */
const randomFrom = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)]
/** 指定範囲のランダムな整数を返します */
const randomInt = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min))

/**
 * 要素を複製します
 * @param template 複製する要素
 * @param count 複製数
 * @param appendTo 挿入先。省略すると元の要素と同じ親要素に追加
 * @returns 複製した要素
 */
const clonElement = <E extends Element>(
  template: E,
  count = 1,
  appendTo?: Element
): E[] => {
  const countInt = Math.floor(count)
  if (countInt < 1) return []
  const to = appendTo ?? template.parentElement
  if (!to) return []
  return Array(countInt)
    .fill(null)
    .map((_) => to.appendChild(template.cloneNode(true)) as E)
}

/** カードを複製してランダムなステージを生成します */
const createCards = () => {
  const stage = document.querySelector(STAGE_SELECTOR)
  const templateCard = document.querySelector(TEMPLATE_CARD_SELECTOR)
  if (!stage || !templateCard) return

  // カードを複製
  const cards = clonElement(templateCard, CARD_COUNT, stage)
  // カード内の画像とテキストを複製して増やす
  const imgs = cards.map((card) => card.querySelector('.img')).filter(notNull)
  const texts = cards.map((card) => card.querySelector('.text')).filter(notNull)
  ;[...imgs, ...texts].forEach((el) =>
    clonElement(el, randomInt(0, LIST_CHILD_MAX))
  )
  // 全ての画像にランダムなsrcを設定
  stage
    .querySelectorAll('.img')
    .forEach((img) =>
      img.setAttribute(
        'src',
        IMG_SRC.replace('{seed}', randomInt(1, 10000).toString())
      )
    )
}

/**
 * ステージ内のターゲットがビューに入ったらアニメーションを発動するIntersectionObserverを初期化
 * createCardsでステージを生成してから実行する
 */
const initIntersection = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        if (!isHTMLOrSvgElement(el)) return
        if (el.classList.contains('show')) return
        setTimeout(() => {
          el.style.animationDuration = `${randomInt(300, 1200)}ms`
          el.classList.add('show', randomFrom(ANIM_CLASSES))
        }, randomInt(0, 500))
      })
    },
    { rootMargin: '0px 0px -15%' }
  )

  const stage = document.querySelector(STAGE_SELECTOR)
  if (!stage) return
  const cards = stage.querySelectorAll('.target')
  cards.forEach((card) => observer.observe(card))
}

/** デモ用のランダムなステージを生成します */
export const initDemoStage = () => {
  createCards()
  initIntersection()
}
