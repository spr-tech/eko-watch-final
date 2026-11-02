// A gentle 3D tilt of one card towards the mouse pointer (the sign-in card), easing back
// flat when the pointer leaves. Only on devices with a mouse, never under reduced motion,
// and never while a field in the card has focus, so typing happens on a flat card with
// crisp text. Plain CSS transforms, written at most once per animation frame.
import { useEffect, useSyncExternalStore, type RefObject } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// The most the card turns on each axis, in degrees.
export const MAX_TILT_DEG = 3

const MOUSE_QUERY = '(hover: hover) and (pointer: fine)'

function subscribeMouse(onChange: () => void) {
  const media = window.matchMedia(MOUSE_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function useHasMouse(): boolean {
  return useSyncExternalStore(subscribeMouse, () => window.matchMedia(MOUSE_QUERY).matches)
}

type Box = { left: number; top: number; width: number; height: number }

// The rotation for a pointer at (x, y) over a card: the edge nearest the pointer dips
// away, up to MAX_TILT_DEG at the card's edges. Outside the card it stays at the limit.
export function tiltFor(x: number, y: number, box: Box): { rotateX: number; rotateY: number } {
  const clamp = (n: number) => Math.min(1, Math.max(-1, n))
  const across = clamp(((x - box.left) / box.width) * 2 - 1)
  const down = clamp(((y - box.top) / box.height) * 2 - 1)
  return { rotateX: -down * MAX_TILT_DEG, rotateY: across * MAX_TILT_DEG }
}

function isTyping(card: HTMLElement): boolean {
  const active = document.activeElement
  return active !== null && card.contains(active) && active.matches('input, textarea, select')
}

export function useCardTilt(ref: RefObject<HTMLElement | null>) {
  const reducedMotion = usePrefersReducedMotion()
  const hasMouse = useHasMouse()

  useEffect(() => {
    const card = ref.current
    if (!card || reducedMotion || !hasMouse) return
    const el = card
    let frame = 0
    let pointer: { x: number; y: number } | null = null

    function draw() {
      frame = 0
      if (!pointer || isTyping(el)) return
      const { rotateX, rotateY } = tiltFor(pointer.x, pointer.y, el.getBoundingClientRect())
      el.style.transition = 'transform 150ms ease-out'
      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`
    }

    // Back to no transform at all (not a zero rotation), so the text renders sharp again.
    function flatten() {
      cancelAnimationFrame(frame)
      frame = 0
      pointer = null
      el.style.transition = 'transform 400ms ease-out'
      el.style.transform = ''
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(draw)
    }

    function onFocusIn() {
      if (isTyping(el)) flatten()
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', flatten)
    el.addEventListener('focusin', onFocusIn)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', flatten)
      el.removeEventListener('focusin', onFocusIn)
      cancelAnimationFrame(frame)
      el.style.transition = ''
      el.style.transform = ''
    }
  }, [ref, reducedMotion, hasMouse])
}
