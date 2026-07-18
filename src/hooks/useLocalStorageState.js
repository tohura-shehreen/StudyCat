import { useEffect, useRef, useState } from 'react'

/**
 * Works exactly like useState, but reads its initial value from
 * localStorage and writes back to it on every change. This is the
 * entire "database" for StudyCat: everything lives on this device,
 * keyed by browser/profile, no account needed.
 */
export function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : defaultValue
    } catch {
      return defaultValue
    }
  })

  // Avoid writing back the very first render with the value we just read.
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or unavailable (private browsing) — fail silently,
      // the app still works for the current session.
    }
  }, [key, value])

  return [value, setValue]
}
