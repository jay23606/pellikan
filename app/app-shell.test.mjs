import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// The shell is a template, not a component we can mount without a DOM, so check its markup directly.
const source = readFileSync(new URL('./app.vue', import.meta.url), 'utf8')
const template = source.slice(source.indexOf('<template>'))

test('the shell opens with a skip link and a focusable main landmark', () => {
  const skip = template.search(/<a\b[^>]*href="#main"[^>]*>Skip to main content<\/a>/)
  assert.ok(skip !== -1 && skip < template.indexOf('<AppSidebar'), 'no skip link to #main before the sidebar')
  assert.match(template, /<main\b[^>]*\bid="main"[^>]*\btabindex="-1"/, 'main is not focusable as #main')
})
