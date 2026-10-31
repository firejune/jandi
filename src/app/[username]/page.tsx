import format from 'date-fns/format'
import startOfWeek from 'date-fns/startOfWeek'
import isAfter from 'date-fns/isAfter'
import addMonths from 'date-fns/addMonths'
import addWeeks from 'date-fns/addWeeks'
import addDays from 'date-fns/addDays'
import differenceInCalendarWeeks from 'date-fns/differenceInCalendarWeeks'

import Chart, { Contrib } from './Chart'
import Canvas from './Canvas'

const DATE_FORMAT = 'yyyy-MM-dd'
const FALSY = ['0', 'false', 'hide', 'hidden', 'none']
const HOST = process.env.API_HOST

type DataStruct = {
  total: number
  range: { start: string; end: string }
  contributions: Contrib[]
}

type PageProps = {
  params: {
    username: string
    element: 'svg' | 'canvas'
  }
  searchParams: {
    scheme: 'light' | 'dark'
    dark: string
    white: string
    halloween: string
    radius: string
    margin: string
    footer: string
    weeks: string
    tz: string
    v: string
  }
}

export default async function ChartPage({
  params: { username, element },
  searchParams: { tz: timeZone = 'Asia/Seoul', ...searchParams },
}: PageProps) {
  const force = searchParams.v || `${Date.now()}`.substring(0, 8)
  const { data } = await getData<DataStruct>(`${HOST}/api/v1/${username}${force ? `?v=${force}` : ''}`)
  const presentDate = new Date(new Date().toLocaleString('en', { timeZone }))
  let pastDate = startOfWeek(addMonths(presentDate, -12))
  if (differenceInCalendarWeeks(presentDate, pastDate) > 52) {
    pastDate = addWeeks(pastDate, 1)
  }

  const graphEntries = Array.from({ length: 53 }).map(
    () =>
      Array.from({ length: 7 })
        .map(() => {
          const date = format(pastDate, DATE_FORMAT)
          if (isAfter(pastDate, presentDate)) return null
          pastDate = addDays(pastDate, 1)
          // return { date, count: 0}
          return getDateContrib(data, date) || { date }
        })
        .filter(contrib => contrib) as Contrib[],
  )

  const count = new Intl.NumberFormat().format(data.total)
  const options = {
    ...(searchParams.weeks ? { showWeekDays: !FALSY.includes(searchParams.weeks) } : {}),
    ...(searchParams.footer ? { showFooter: !FALSY.includes(searchParams.footer) } : {}),
    ...(searchParams.radius ? { borderRadius: Number(searchParams.radius) } : {}),
    ...(searchParams.margin ? { boxMargin: Number(searchParams.margin) } : {}),
  }

  const Element = element === 'canvas' ? Canvas : Chart
  const { scheme, dark, white } = searchParams
  const isHalloweenDay = format(presentDate, 'MM-dd') === '10-31'
  const halloween = searchParams.halloween ? !FALSY.includes(searchParams.halloween) : isHalloweenDay
  const darkColors = parseColors(dark, '#191919')
  const whiteColors = parseColors(white, '#fff')
  const defaultText = 'rgba(128, 128, 128, 0.9)'
  const hasText = Boolean(darkColors.text || whiteColors.text)
  const active = scheme === 'dark' ? darkColors : whiteColors
  const style = scheme
    ? `html,body{background-color:${active.bg}}${
        active.text ? `:root,svg[data-color-mode],canvas[data-color-mode]{--color-text-default:${active.text}}` : ''
      }`
    : (dark || white) &&
      `:root{--color-bg-default:${whiteColors.bg}${
        hasText ? `;--color-text-default:${whiteColors.text || defaultText}` : ''
      }}@media(prefers-color-scheme:dark){:root{--color-bg-default:${darkColors.bg}${
        hasText ? `;--color-text-default:${darkColors.text || defaultText}` : ''
      }}}`

  return (
    <>
      {style && <style>{style}</style>}
      <Element
        data={graphEntries}
        count={count}
        username={username}
        scheme={scheme}
        halloween={halloween}
        options={options}
      />
    </>
  )
}

function parseColors(value: string | undefined, defaultBg: string) {
  const [bg, text] = (value || '').split(',')
  return {
    bg: formatColor(bg, defaultBg),
    text: text ? formatColor(text, '') : undefined,
  }
}

function formatColor(color: string | undefined, fallback: string) {
  if (!color) return fallback
  const trimmed = color.trim()
  if (!trimmed) return fallback
  return /^(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(trimmed) ? `#${trimmed}` : trimmed
}

async function getData<T>(url: string): Promise<{ data: T }> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await res.json()
  return { data }
}

function getDateContrib(data: DataStruct, date: string) {
  return data.contributions.find(contrib => contrib.date === date)
}
