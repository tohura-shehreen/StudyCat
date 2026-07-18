import { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import {
  CATS,
  ACCESSORIES,
  DECORATIONS,
  DEFAULT_FOCUS_LABELS,
  NOTEPAD_SWATCHES,
  FISH_PER_FOCUS_MINUTE,
} from '../data/constants'

const StoreContext = createContext(null)

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function StoreProvider({ children }) {
  const [fish, setFish] = useLocalStorageState('studycat.fish', 0)

  const [ownedCatIds, setOwnedCatIds] = useLocalStorageState('studycat.ownedCats', [
    CATS[0].id,
  ])
  const [equippedCatId, setEquippedCatId] = useLocalStorageState(
    'studycat.equippedCat',
    CATS[0].id,
  )

  const [ownedAccessoryIds, setOwnedAccessoryIds] = useLocalStorageState(
    'studycat.ownedAccessories',
    [],
  )
  const [equippedAccessoryId, setEquippedAccessoryId] = useLocalStorageState(
    'studycat.equippedAccessory',
    null,
  )

  const [ownedDecorationIds, setOwnedDecorationIds] = useLocalStorageState(
    'studycat.ownedDecorations',
    [],
  )
  // placedDecorations: { [decorationId]: { x, y } } as percentages of the room
  const [placedDecorations, setPlacedDecorations] = useLocalStorageState(
    'studycat.placedDecorations',
    {},
  )

  const [focusLabels, setFocusLabels] = useLocalStorageState(
    'studycat.focusLabels',
    DEFAULT_FOCUS_LABELS,
  )

  // One-time cleanup: drop any focus label whose color isn't a real swatch
  // anymore (leftover from the old tan/blue/sage/steel flat-card colors that
  // were retired). Those used to silently fall back to a generic gray-brown
  // placeholder color, showing up as confusing unlabeled duplicates.
  useEffect(() => {
    const validColors = new Set(NOTEPAD_SWATCHES.map((s) => s.id))
    setFocusLabels((labels) => {
      const cleaned = labels.filter((l) => validColors.has(l.color))
      return cleaned.length === labels.length ? labels : cleaned
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Which notepad color / timer type was last picked, so the room's mode
  // tiles (the tomato + notepad buttons) can show the matching icon instead
  // of always showing the generic tomato/notepad art.
  const [activeNotepadColor, setActiveNotepadColor] = useLocalStorageState(
    'studycat.activeNotepadColor',
    DEFAULT_FOCUS_LABELS[0]?.color || 'coral',
  )
  const [lastTimerType, setLastTimerType] = useLocalStorageState(
    'studycat.lastTimerType',
    'pomodoro',
  )

  // sessions: array of { id, date: 'YYYY-MM-DD', type, labelId, minutes, startedAt, endedAt }
  const [sessions, setSessions] = useLocalStorageState('studycat.sessions', [])

  function buyItem(kind, item) {
    if (fish < item.price) return false
    setFish((f) => f - item.price)
    if (kind === 'cat') setOwnedCatIds((ids) => [...ids, item.id])
    if (kind === 'accessory') setOwnedAccessoryIds((ids) => [...ids, item.id])
    if (kind === 'decoration') {
      setOwnedDecorationIds((ids) => [...ids, item.id])
      setPlacedDecorations((placed) => ({
        ...placed,
        [item.id]: { x: item.defaultX, y: item.defaultY },
      }))
    }
    return true
  }

  function equipCat(catId) {
    setEquippedCatId(catId)
  }

  function toggleAccessory(accessoryId) {
    setEquippedAccessoryId((current) => (current === accessoryId ? null : accessoryId))
  }

  function moveDecoration(decorationId, x, y) {
    setPlacedDecorations((placed) => ({ ...placed, [decorationId]: { x, y } }))
  }

  function addFocusLabel(name, color) {
    const trimmed = name.trim()
    const newLabel = {
      id: `label-${Date.now()}`,
      name: trimmed,
      color,
    }
    setFocusLabels((labels) => [...labels, newLabel])
    return newLabel
  }

  /** Create a label for this color if one doesn't exist yet, otherwise rename it. */
  function setLabelForColor(color, name) {
    const trimmed = name.trim()
    setFocusLabels((labels) => {
      const existing = labels.find((l) => l.color === color)
      if (!trimmed) {
        // Empty name clears the label for that color entirely.
        return labels.filter((l) => l.color !== color)
      }
      if (existing) {
        return labels.map((l) => (l.color === color ? { ...l, name: trimmed } : l))
      }
      return [...labels, { id: `label-${Date.now()}`, name: trimmed, color }]
    })
  }

  /**
   * Called when a focus timer (countdown / pomodoro-focus / stopwatch)
   * finishes or is stopped. Awards fish and stores the session so it shows
   * up on the calendar. Breaks are recorded too (for the timeline) but earn
   * no fish.
   */
  function recordSession({ type, labelId, minutes, isBreak, date }) {
    const roundedMinutes = Math.max(0, Math.round(minutes))
    const session = {
      id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: date || todayISO(),
      type,
      labelId: labelId || null,
      minutes: roundedMinutes,
      isBreak: !!isBreak,
      recordedAt: new Date().toISOString(),
    }
    setSessions((list) => [...list, session])
    if (!isBreak && roundedMinutes > 0) {
      setFish((f) => f + roundedMinutes * FISH_PER_FOCUS_MINUTE)
    }
    return session
  }

  function sessionsForDate(dateISO) {
    return sessions.filter((s) => s.date === dateISO)
  }

  const value = useMemo(
    () => ({
      fish,
      cats: CATS,
      accessories: ACCESSORIES,
      decorations: DECORATIONS,
      ownedCatIds,
      equippedCatId,
      ownedAccessoryIds,
      equippedAccessoryId,
      ownedDecorationIds,
      placedDecorations,
      focusLabels,
      sessions,
      activeNotepadColor,
      setActiveNotepadColor,
      lastTimerType,
      setLastTimerType,
      buyItem,
      equipCat,
      toggleAccessory,
      moveDecoration,
      addFocusLabel,
      setLabelForColor,
      recordSession,
      sessionsForDate,
      todayISO,
    }),
    [
      fish,
      ownedCatIds,
      equippedCatId,
      ownedAccessoryIds,
      equippedAccessoryId,
      ownedDecorationIds,
      placedDecorations,
      focusLabels,
      sessions,
      activeNotepadColor,
      lastTimerType,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
