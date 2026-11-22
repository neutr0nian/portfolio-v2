import type { FragmentKind } from './wind'

export type WindParticle = {
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  spin: number
  age: number
  life: number
  phase: number
  speed: number
  kind: FragmentKind
}

export function advanceParticle(particle: WindParticle, pressure: number, flowSpeed: number, dt: number) {
  const drag = { petal: 4.8, twig: 3.4, branch: 2.7 }[particle.kind]
  const targetX = (pressure * flowSpeed + flowSpeed * 0.28) * particle.speed
  particle.vx += (targetX - particle.vx) * (1 - Math.exp(-drag * dt))
  const lift = -12 - pressure * 8 + Math.sin(particle.age * 2.2 + particle.phase) * 18
  particle.vy += (lift - particle.vy) * (1 - Math.exp(-0.9 * dt))
  particle.vy += (particle.kind === 'branch' ? 15 : 5) * dt
  particle.x += particle.vx * dt
  particle.y += particle.vy * dt
  particle.angle += particle.spin * dt
  particle.age += dt
}

export function particleOpacity(age: number, life: number) {
  const progress = Math.min(1, Math.max(0, (age / life - 0.55) / 0.45))
  return 1 - progress * progress * (3 - 2 * progress)
}
