import test from 'node:test'
import assert from 'node:assert/strict'
import { advanceParticle, particleOpacity } from '../src/motion/windParticles.ts'

const fragment = () => ({ x: 100, y: 200, vx: 0, vy: 0, angle: 0, spin: 15, age: 0, life: 6.5, phase: 0, speed: 1, kind: 'petal' })

test('free fragments accelerate left to right in response to pressure', () => {
  const weak = fragment(), strong = fragment()
  for (let i = 0; i < 60; i++) {
    advanceParticle(weak, 1.6, 280, 1 / 60)
    advanceParticle(strong, 4.3, 280, 1 / 60)
  }
  assert.ok(weak.x > 100)
  assert.ok(strong.x > weak.x)
  assert.ok(strong.vx > weak.vx)
  assert.ok(Math.abs(strong.age - 1) < 1e-12)
})

test('twigs and branches respond more slowly than light petals', () => {
  const petal = fragment(), branch = { ...fragment(), kind: 'branch' }
  for (let i = 0; i < 10; i++) {
    advanceParticle(petal, 3, 280, 1 / 60)
    advanceParticle(branch, 3, 280, 1 / 60)
  }
  assert.ok(petal.vx > branch.vx)
  assert.ok(petal.x > branch.x)
})

test('fragments remain visible before gradually fading at the end of their flight', () => {
  assert.equal(particleOpacity(0, 6), 1)
  assert.equal(particleOpacity(3.3, 6), 1)
  assert.ok(particleOpacity(4.5, 6) < 1 && particleOpacity(4.5, 6) > 0)
  assert.equal(particleOpacity(6, 6), 0)
  assert.equal(particleOpacity(8, 6), 0)
  let previous = 1
  for (let age = 0; age < 7; age += 0.05) {
    const opacity = particleOpacity(age, 6)
    assert.ok(opacity <= previous)
    previous = opacity
  }
})
