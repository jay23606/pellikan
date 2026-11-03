import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { validId, PACK_QUERIES, installedIds, packDb, remove } from './packs.ts'

test('validId validates translation pack identifiers', () => {
  assert.equal(validId('KJV'), true)
  assert.equal(validId('WEB'), true)
  assert.equal(validId('BSB_1'), true)
  assert.equal(validId('DARBY_1890'), true)
  assert.equal(validId('A'), true)
  assert.equal(validId('1234567890123456'), true)

  // Disallowed: lowercase, invalid punctuation, whitespace, directory traversal, length > 16
  assert.equal(validId('kjv'), false)
  assert.equal(validId('WEB-1'), false)
  assert.equal(validId('WEB 1'), false)
  assert.equal(validId('../WEB'), false)
  assert.equal(validId(''), false)
  assert.equal(validId('TOOLONGTRANSLATIONID'), false)
  assert.equal(validId(null), false)
  assert.equal(validId(undefined), false)
  assert.equal(validId(123), false)
  assert.equal(validId({}), false)
})

test('PACK_QUERIES lists allowed reader and search queries', () => {
  const expected = [
    'chapter_verses',
    'chapter_headings',
    'chapter_notes',
    'search_verses',
    'search_verses_count',
  ]
  assert.deepEqual([...PACK_QUERIES].sort(), [...expected].sort())
})

test('installedIds filters for valid pack filenames only', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pellikan-packs-test-'))
  const orig = process.env.PELLIKAN_PACKS_DIR
  process.env.PELLIKAN_PACKS_DIR = dir

  try {
    assert.deepEqual(installedIds(), [])

    writeFileSync(join(dir, 'ASV.db'), '')
    writeFileSync(join(dir, 'YLT.db'), '')
    writeFileSync(join(dir, '.ASV.installing'), '')
    writeFileSync(join(dir, 'random.txt'), '')
    writeFileSync(join(dir, 'invalid-name.db'), '')

    const ids = installedIds().sort()
    assert.deepEqual(ids, ['ASV', 'YLT'])
  } finally {
    process.env.PELLIKAN_PACKS_DIR = orig
    rmSync(dir, { recursive: true, force: true })
  }
})

test('packDb returns null for invalid id or missing database', () => {
  assert.equal(packDb(''), null)
  assert.equal(packDb('invalid!'), null)
  assert.equal(packDb('NONEXISTENT'), null)
})

test('remove rejects invalid translation id', () => {
  assert.throws(() => remove('invalid!'), /not a valid translation id/)
  assert.throws(() => remove('../KJV'), /not a valid translation id/)
})

