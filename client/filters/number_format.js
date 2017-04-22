export function comma(number, period) {
  return `${number}`.replace(new RegExp(`(\\d)(?=(\\d{${period}})+$)`, 'g'), '$1,');
}
