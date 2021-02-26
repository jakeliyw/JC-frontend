
export function maxDecimal(number) {
  number = String(number).replace(/^(.*\..{4}).*$/, '$1')
  return Number(number)
}
export function maxDecimal2(number) {
  number = String(number).replace(/^(.*\..{2}).*$/, '$1')
  return Number(number)
}
