import { formatDistanceToNow, parseISO } from '/modules/date-fns.js'

const transformDate = dateISO => {
  return formatDistanceToNow(parseISO(dateISO), { addSuffix: true })
}

export { transformDate }
