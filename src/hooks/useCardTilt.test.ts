import { describe, expect, it } from 'vitest'
import { MAX_TILT_DEG, tiltFor } from '@/hooks/useCardTilt'

const box = { left: 100, top: 50, width: 400, height: 200 }

describe('tiltFor', () => {
  it('stays flat with the pointer at the centre', () => {
    const { rotateX, rotateY } = tiltFor(300, 150, box)
    expect(rotateX).toBeCloseTo(0)
    expect(rotateY).toBeCloseTo(0)
  })

  it('dips the edge nearest the pointer away, up to the limit', () => {
    expect(tiltFor(500, 150, box).rotateY).toBeCloseTo(MAX_TILT_DEG)
    expect(tiltFor(100, 150, box).rotateY).toBeCloseTo(-MAX_TILT_DEG)
    expect(tiltFor(300, 50, box).rotateX).toBeCloseTo(MAX_TILT_DEG)
    expect(tiltFor(300, 250, box).rotateX).toBeCloseTo(-MAX_TILT_DEG)
  })

  it('never turns more than the limit, even outside the card', () => {
    const { rotateX, rotateY } = tiltFor(9999, -9999, box)
    expect(rotateX).toBeCloseTo(MAX_TILT_DEG)
    expect(rotateY).toBeCloseTo(MAX_TILT_DEG)
  })
})
