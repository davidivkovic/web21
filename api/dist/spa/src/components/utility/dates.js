import { formatDistanceToNowStrict, parseISO } from '/modules/date-fns.js'

const transformDate = dateISO => {
  return formatDistanceToNowStrict(parseISO(dateISO))
    .replace(' seconds', 's')
    .replace(' second', 's')
    .replace(/^0s/, 'just now')
    .replace(' minutes', 'm')
    .replace(' minute', 'm')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' weeks', 'w')
    .replace(' week', 'w')
    .replace(' months', 'm')
    .replace(' month', 'm')
    .replace(' years', 'y')
    .replace(' year', 'y')
}

const transformDateLong = dateISO =>
  formatDistanceToNowStrict(parseISO(dateISO), {
    addSuffix: true,
  })

export { transformDate, transformDateLong }
