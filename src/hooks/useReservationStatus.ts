import { useState, useEffect } from "react"
import type { ReservationStatus } from "../types/reservation"

export function getStatus(startsAt: string, endsAt: string, now?: Date): ReservationStatus {
  const n = now ?? new Date()
  const start = new Date(startsAt)
  const end = new Date(endsAt)

  if (n >= start && n < end) return "ocorrendo"
  if (start > n) return "agendada"
  return "finalizada"
}

export function formatTimeRange(startsAt: string, endsAt: string): string {
  const s = new Date(startsAt)
  const e = new Date(endsAt)
  const fmt = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  return `${fmt(s)} - ${fmt(e)}`
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

const nowListeners = new Set<React.Dispatch<React.SetStateAction<Date>>>()
let nowInterval: ReturnType<typeof setInterval> | null = null

export function useNow() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    nowListeners.add(setNow)

    if (!nowInterval) {
      nowInterval = setInterval(() => {
        const d = new Date()
        nowListeners.forEach((fn) => fn(d))
      }, 30_000)
    }

    return () => {
      nowListeners.delete(setNow)
      if (nowListeners.size === 0 && nowInterval) {
        clearInterval(nowInterval)
        nowInterval = null
      }
    }
  }, [])

  return now
}

export function useReservationStatus(startsAt: string, endsAt: string) {
  const now = useNow()
  const start = new Date(startsAt)
  const end = new Date(endsAt)

  if (now >= start && now < end) return "ocorrendo" as const
  if (start > now) return "agendada" as const
  return "finalizada" as const
}
