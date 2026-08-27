export interface HashScrollTrackingOptions {
  offsetTop?: number
  pollInterval?: number
  minTrackingDuration?: number
  stableDuration?: number
  maxTrackingDuration?: number
  tolerance?: number
}

export function waitForHashTarget(targetId: string, timeout = 5000) {
  return new Promise<HTMLElement | null>((resolve) => {
    const root = document.body ?? document.documentElement
    const getTarget = () => document.getElementById(targetId)
    let observer: MutationObserver | null = null
    let timer: ReturnType<typeof window.setTimeout> | number | null = null

    const resolveWithCleanup = (element: HTMLElement | null) => {
      observer?.disconnect()

      if (timer !== null) {
        window.clearTimeout(timer)
        timer = null
      }

      resolve(element)
    }

    const initialTarget = getTarget()
    if (initialTarget) {
      resolve(initialTarget)
      return
    }

    if (root) {
      observer = new MutationObserver(() => {
        const element = getTarget()

        if (element)
          resolveWithCleanup(element)
      })

      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['id'],
      })
    }

    timer = window.setTimeout(() => {
      resolveWithCleanup(getTarget())
    }, timeout)
  })
}

export function startHashScrollTracking(
  element: HTMLElement,
  options: HashScrollTrackingOptions = {},
) {
  const {
    offsetTop = 70,
    pollInterval = 50,
    minTrackingDuration = 1500,
    stableDuration = 500,
    maxTrackingDuration = 5000,
    tolerance = 1,
  } = options
  const startedAt = Date.now()
  const interactionEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const
  let lastAbsoluteTop: number | null = null
  let stableSince = startedAt
  let timer: number | null = null
  let stopped = false

  const stop = () => {
    if (stopped)
      return

    stopped = true

    if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
    }

    interactionEvents.forEach(eventName => window.removeEventListener(eventName, stop))
  }

  const align = () => {
    if (stopped)
      return

    if (!element.isConnected) {
      stop()
      return
    }

    const now = Date.now()
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop
    const absoluteTop = element.getBoundingClientRect().top + currentScrollTop
    const nextScrollTop = Math.max(absoluteTop - offsetTop, 0)

    if (Math.abs(nextScrollTop - currentScrollTop) > tolerance) {
      window.scrollTo({
        left: 0,
        top: nextScrollTop,
        behavior: 'auto',
      })
    }

    if (lastAbsoluteTop === null || Math.abs(absoluteTop - lastAbsoluteTop) > tolerance)
      stableSince = now

    lastAbsoluteTop = absoluteTop

    const trackingDuration = now - startedAt
    const stableDurationReached = now - stableSince >= stableDuration
    if (
      trackingDuration >= maxTrackingDuration
      || (trackingDuration >= minTrackingDuration && stableDurationReached)
    ) {
      stop()
      return
    }

    timer = window.setTimeout(align, pollInterval)
  }

  interactionEvents.forEach(eventName => window.addEventListener(eventName, stop, { passive: true }))
  align()

  return stop
}

export async function waitForStablePosition(el: HTMLElement, frames = 3, timeout = 3000) {
  return new Promise<void>((resolve) => {
    let lastTop = el.getBoundingClientRect().top
    let stable = 0
    const start = performance.now()

    const tick = () => {
      const top = el.getBoundingClientRect().top
      if (Math.abs(top - lastTop) < 1) {
        stable += 1
        if (stable >= frames) {
          resolve()
          return
        }
      }
      else {
        stable = 0
        lastTop = top
      }
      if (performance.now() - start > timeout) {
        resolve()
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}
