// page: the help page: an mrepo's help info by keywords, as `haicc <at>
// info/get <keywords>` answers, drawn (README.md beside it).
import { draw } from '../draw/index.js'

// The mrepo read when none is asked for: the docs mrepo, the install's
// manual.
export const DEFAULT = 'docs'
const AT = /^[a-z][a-z0-9-]*(\/[a-z][a-z0-9-]*)*$/

// form: { uri: the keywords, the path below the component; query: { at } }
// Its links relative to its section: right wherever it is mounted (the
// site gives the page its base).
export async function page (exec, { uri = '', query = {} } = {}) {
  const at = query.at ?? DEFAULT
  if (!AT.test(at)) throw new Error(`not an mrepo's position: ${at}`)
  const keywords = String(uri ?? '').split('/').filter(Boolean).join('/')
  const suffix = at === DEFAULT ? '' : `?at=${encodeURIComponent(at)}`
  const href = k => `${k}${suffix}`
  // the data: the platform's, asked for; the page: drawn
  const command = keywords ? ['info/get', keywords] : ['info/get']
  let answer = null
  let error = null
  try { answer = await exec.data(at, command) } catch (err) { error = err.message }
  const names = keywords ? keywords.split('/') : []
  const crumbs = [{ label: at, href: `./${suffix}` }, ...names.map((n, i) => ({ label: n, href: i < names.length - 1 ? href(names.slice(0, i + 1).join('/')) : null }))]
  const choices = Array.isArray(answer?.choices) ? answer.choices : []
  // where a section is from, when that is not obvious: several answers, or one page several packages share
  const from = c => (choices.length > 1 || (c.packages?.length ?? 0) > 1) ? (c.packages ?? []) : []
  const sections = choices.map(c => ({
    title: c.title,
    from: from(c),
    markdown: c.page ?? c.oneliner ?? '',
    below: (c.below ?? []).map(b => ({ label: b.keyword, href: href(b.keyword), oneliner: b.oneliner, pages: b.choices ?? 1 }))
  }))
  // a keyword not there: the nearest one and what is below it, as links
  const missing = /^no .+ here: nearest (\S+), below it (.+)$/.exec(error ?? '')
  const near = missing
    ? { label: missing[1], href: missing[1] === '.' ? `./${suffix}` : href(missing[1]), below: missing[2] === 'nothing' ? [] : missing[2].split(', ').map(n => { const k = missing[1] === '.' ? n : `${missing[1]}/${n}`; return { label: k, href: href(k) } }) }
    : null
  exec.log('verbose', 'page', { at, keywords: keywords || '.', choices: choices.length, error })
  return draw({
    title: keywords ? `${keywords} · ${at}` : at,
    crumbs,
    sections,
    error: error ?? (choices.length ? null : `nothing at ${keywords || '.'}`),
    near,
    at: { value: at, default: DEFAULT },
    footer: `\`haicc ${at} ${command.join(' ')}\``
  })
}
