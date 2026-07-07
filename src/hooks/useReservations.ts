import { useState, useEffect, useRef } from "react"
import {
  listReservations,
  createReservation as apiCreate,
  updateReservation as apiUpdate,
  deleteReservation as apiDelete,
  checkReservationConflict,
} from "../services/supabaseSDK"
import type {
  ReservationWithRoom,
  CreateReservationDTO,
  UpdateReservationDTO,
  ReservationStatus,
  ListReservationsFilters,
} from "../types/reservation"

interface UseReservationsFilters {
  roomId?: string
  status?: ReservationStatus
}

export function useReservations(filters?: UseReservationsFilters) {
  const [reservations, setReservations] = useState<ReservationWithRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [key, setKey] = useState(0)
  const reservationsRef = useRef<ReservationWithRoom[]>([])

  const roomId = filters?.roomId
  const status = filters?.status

  useEffect(() => {
    reservationsRef.current = reservations
  }, [reservations])

  useEffect(() => {
    let cancelled = false
    const listFilters: ListReservationsFilters = {
      roomId,
      status,
      orderBy: "starts_at",
      orderDirection: "asc",
    }
    listReservations(listFilters)
      .then((data) => { if (!cancelled) setReservations(data) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Erro ao carregar reservas") })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [roomId, status, key])

  async function create(dto: CreateReservationDTO): Promise<string | null> {
    setActionLoading(true)
    try {
      const conflict = await checkReservationConflict(
        dto.room_id,
        dto.starts_at,
        dto.ends_at
      )
      if (conflict.hasConflict) {
        const start = new Date(conflict.reservation.starts_at)
        const end = new Date(conflict.reservation.ends_at)
        const fmt = (d: Date) =>
          `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
        return `${conflict.roomName} já reservada das ${fmt(start)} às ${fmt(end)}`
      }
      await apiCreate(dto)
      setError(null)
      setKey((k) => k + 1)
      return null
    } catch (err) {
      return err instanceof Error ? err.message : "Erro ao criar reserva"
    } finally {
      setActionLoading(false)
    }
  }

  async function update(
    id: string,
    dto: UpdateReservationDTO
  ): Promise<string | null> {
    setActionLoading(true)
    try {
      if (dto.starts_at && dto.ends_at) {
        const current = reservationsRef.current.find((r) => r.id === id)
        const conflict = await checkReservationConflict(
          dto.room_id ?? current?.room_id ?? "",
          dto.starts_at,
          dto.ends_at,
          id
        )
        if (conflict.hasConflict) {
          const start = new Date(conflict.reservation.starts_at)
          const end = new Date(conflict.reservation.ends_at)
          const fmt = (d: Date) =>
            `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
          return `${conflict.roomName} já reservada das ${fmt(start)} às ${fmt(end)}`
        }
      }
      await apiUpdate(id, dto)
      setError(null)
      setKey((k) => k + 1)
      return null
    } catch (err) {
      return err instanceof Error ? err.message : "Erro ao atualizar reserva"
    } finally {
      setActionLoading(false)
    }
  }

  async function remove(id: string): Promise<string | null> {
    setActionLoading(true)
    try {
      await apiDelete(id)
      setError(null)
      setKey((k) => k + 1)
      return null
    } catch (err) {
      return err instanceof Error ? err.message : "Erro ao excluir reserva"
    } finally {
      setActionLoading(false)
    }
  }

  return {
    reservations,
    loading,
    error,
    actionLoading,
    refresh: () => { setError(null); setLoading(true); setKey((k) => k + 1) },
    create,
    update,
    remove,
  }
}
