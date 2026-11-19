# draw

The help page as HTML, whole: its sections in markdown, the keywords below each as links.

## Signature

`draw(input)`: `input` the page, `{ title, crumbs, sections, error,
near, at, footer }`: `crumbs` where it is, `[{ label, href }]`;
`sections` each `{ title, from, markdown, below: [{ label, href,
oneliner, pages }] }`, `from` the packages it is from, shown when given; `error` said at the top; `near` a keyword not there, the
nearest one and what is below it, `{ label, href, below: [{ label, href
}] }`; `at` the mrepo read, `{ value, default }`; `footer` a line in
markdown at the end.

## Returns

The page, whole: HTML with its style in it.

## Errors

- No page given: `missing argument: page`.

## Design

- **Self-contained**: its style with it, light and dark; nothing loaded
  from elsewhere, no script.
- **A section's own heading not repeated**: its markdown's first
  heading is the section's title, drawn once.
- **Where to go next, on the page**: a keyword below says how many
  pages it opens when more than one; a keyword not there gives the
  nearest one and what is below it as links; another mrepo is read by
  a plain form (`?at=<position>`, its section's top).
