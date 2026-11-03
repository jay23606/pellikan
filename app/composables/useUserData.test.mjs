import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('./useUserData.ts', import.meta.url), 'utf8')

test('user data loads saved preferences eagerly while keeping localStorage out of SSR setup', () => {
  assert.match(source, /if\s*\(!loaded\.value\s*&&\s*typeof localStorage !== 'undefined'\)\s*\{\s*prefs\.value\s*=\s*load<Prefs>\(KEYS\.prefs,\s*prefs\.value\)\s*\}/,
    'saved preferences are not loaded before the reader reads translation.id')
})
