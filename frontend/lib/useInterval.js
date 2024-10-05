import { useEffect, useRef } from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useInterval(callback, delay, condition, deps) {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay === null) {
      return
    }

    if (!condition) return

    const id = setInterval(() => {
      savedCallback.current()
    }, delay)

    return () => {
      clearInterval(id)
    }
  }, [delay, deps])
}
