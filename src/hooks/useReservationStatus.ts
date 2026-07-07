import { useState, useEffect } from "react"
import type { ReservationStatus } from "../types/reservation"

function getNow(): Date {
  return new Date()
}

export function getStatus(startsAt: string, endsAt: string, now?: Date): ReservationStatus {
  const n = now ?? getNow()
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

export function useNow() {
  const [now, setNow] = useState(getNow)

  useEffect(() => {
    const id = setInterval(() => setNow(getNow()), 30_000)
    return () => clearInterval(id)
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
