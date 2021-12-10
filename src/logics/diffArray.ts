export const diffArray = <T>(olds: T[], news: T[]): {
  added: T[],
  removed: T[]
} => {
  return {
    added: news.filter(ent => !olds.includes(ent)),
    removed: olds.filter(ent => !news.includes(ent)),
  }
}
