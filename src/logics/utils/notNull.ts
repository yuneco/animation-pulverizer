/**
 * valueがnullでないことを検証するユーザー定義タイプガードです。
 * Array.filter等でnull除去する際に利用することを意図しています。
 * 例： const nums = [1, null, 3].filter<number>(notNull);
 * → numsは[1, 3]となり、型もnumber[]と推論される
 * @param value
 * @see https://twitter.com/uhyo_/status/1187567769941753856
 */
export const notNull = <T>(value: T): value is NonNullable<T> => value != null;
