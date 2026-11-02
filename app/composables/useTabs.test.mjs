import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tabTitle, DEFAULT_PATH } from './useTabs.ts'
import { verseKey, HIGHLIGHT_COLORS } from './useUserData.ts'

test('tabTitle parses reader routes', () => {
  assert.deepEqual(tabTitle('/read/Rom/8'), { title: 'Romans 8', kind: 'read' })
  assert.deepEqual(tabTitle('/read/1Cor/13'), { title: '1 Corinthians 13', kind: 'read' })
  assert.deepEqual(tabTitle('/read/John/1'), { title: 'John 1', kind: 'read' })
  assert.deepEqual(tabTitle('/read/Ps/23'), { title: 'Psalms 23', kind: 'read' })
  // Unknown book fallback uses the raw segment
  assert.deepEqual(tabTitle('/read/UnknownBook/5'), { title: 'UnknownBook 5', kind: 'read' })
})

test('tabTitle parses search routes with and without query', () => {
  assert.deepEqual(tabTitle('/search'), { title: 'Search', kind: 'search' })
  assert.deepEqual(tabTitle('/search?q=grace'), { title: 'Search: grace', kind: 'search' })
  assert.deepEqual(tabTitle('/search?q='), { title: 'Search', kind: 'search' })
})

test('tabTitle parses known static pages and fallbacks', () => {
  assert.deepEqual(tabTitle('/library'), { title: 'Library', kind: 'page' })
  assert.deepEqual(tabTitle('/dictionary'), { title: 'Dictionary', kind: 'page' })
  assert.deepEqual(tabTitle('/notes'), { title: 'Notes', kind: 'page' })
  assert.deepEqual(tabTitle('/highlights'), { title: 'Highlights', kind: 'page' })
  assert.deepEqual(tabTitle('/credits'), { title: 'Credits', kind: 'page' })
  assert.deepEqual(tabTitle('/custom-route'), { title: 'Pellikan', kind: 'page' })
})

test('DEFAULT_PATH points to John 1', () => {
  assert.equal(DEFAULT_PATH, '/read/John/1')
})

test('verseKey creates expected canonical key string', () => {
  assert.equal(verseKey('Rom', 8, 28), 'Rom.8.28')
  assert.equal(verseKey('Gen', 1, 1), 'Gen.1.1')
})

test('HIGHLIGHT_COLORS defines standard palette', () => {
  assert.deepEqual(HIGHLIGHT_COLORS, ['yellow', 'green', 'blue', 'rose'])
})

