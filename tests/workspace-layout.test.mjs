import { existsSync } from 'node:fs'
import test from 'node:test'
import assert from 'node:assert/strict'

test('has api and web apps', () => {
  assert.equal(existsSync('apps/api'), true)
  assert.equal(existsSync('apps/web'), true)
})
