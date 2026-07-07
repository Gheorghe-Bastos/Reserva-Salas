import { createClient } from '@supabase/supabase-js'
import type {Room} from '../types/room'
import type {Reservation, ReservationWithRoom, ListReservationsFilters, CreateReservationDTO, ConflictResult, UpdateReservationDTO} from '../types/reservation'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar definidos no .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function listRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function checkReservationConflict(
  roomId: string,
  startsAt: string,
  endsAt: string,
  excludeId?: string
): Promise<ConflictResult> {
  let query = supabase
    .from('reservations')
    .select('*, rooms!inner(name)')
    .eq('room_id', roomId)
    .lt('starts_at', endsAt)
    .gt('ends_at', startsAt)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query.maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return { hasConflict: false }

  const raw = data as Record<string, unknown>
  const roomData = raw.rooms as { name: string } | undefined

  const reservation: Reservation = {
    id: raw.id as string,
    room_id: raw.room_id as string,
    reservation_name: raw.reservation_name as string,
    participant_name: raw.participant_name as string,
    participants_count: raw.participants_count as number,
    starts_at: raw.starts_at as string,
    ends_at: raw.ends_at as string
  }

  return {
    hasConflict: true,
    reservation,
    roomName: roomData?.name ?? 'Sala'
  }
}

export async function listReservations(filters?: ListReservationsFilters): Promise<ReservationWithRoom[]> {
  let query = supabase
    .from('reservations')
    .select('*, rooms(name)')
    .order(filters?.orderBy ?? 'starts_at', { ascending: filters?.orderDirection !== 'desc' })

  if (filters?.roomId) {
    query = query.eq('room_id', filters.roomId)
  }

  const now = new Date().toISOString()

  if (filters?.status === 'ocorrendo') {
    query = query.lte('starts_at', now).gt('ends_at', now)
  } else if (filters?.status === 'agendada') {
    query = query.gt('starts_at', now)
  } else if (filters?.status === 'finalizada') {
    query = query.lte('ends_at', now)
  }

  if (filters?.startDate) {
    query = query.gte('starts_at', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('ends_at', filters.endDate)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return (data ?? []).map((item) => {
    const raw = item as Record<string, unknown>
    const roomData = raw.rooms as { name: string } | undefined
    return {
      id: raw.id as string,
      room_id: raw.room_id as string,
      reservation_name: raw.reservation_name as string,
      participant_name: raw.participant_name as string,
      participants_count: raw.participants_count as number,
      starts_at: raw.starts_at as string,
      ends_at: raw.ends_at as string,
      created_at: raw.created_at as string,
      room_name: roomData?.name ?? ''
    }
  })
}

export async function getReservation(id: string): Promise<ReservationWithRoom | null> {
  const { data, error } = await supabase
    .from('reservations')
    .select('*, rooms(name)')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null

  const raw = data as Record<string, unknown>
  const roomData = raw.rooms as { name: string } | undefined

  return {
    id: raw.id as string,
    room_id: raw.room_id as string,
    reservation_name: raw.reservation_name as string,
    participant_name: raw.participant_name as string,
    participants_count: raw.participants_count as number,
    starts_at: raw.starts_at as string,
    ends_at: raw.ends_at as string,
    created_at: raw.created_at as string,
    room_name: roomData?.name ?? ''
  }
}

export async function createReservation(dto: CreateReservationDTO): Promise<Reservation> {
  const { data, error } = await supabase
    .from('reservations')
    .insert({
      room_id: dto.room_id,
      reservation_name: dto.reservation_name,
      participant_name: dto.participant_name,
      participants_count: dto.participants_count,
      starts_at: dto.starts_at,
      ends_at: dto.ends_at
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateReservation(id: string, dto: UpdateReservationDTO): Promise<Reservation> {
  const updates: Record<string, unknown> = {}
  if (dto.room_id !== undefined) updates.room_id = dto.room_id
  if (dto.reservation_name !== undefined) updates.reservation_name = dto.reservation_name
  if (dto.participant_name !== undefined) updates.participant_name = dto.participant_name
  if (dto.participants_count !== undefined) updates.participants_count = dto.participants_count
  if (dto.starts_at !== undefined) updates.starts_at = dto.starts_at
  if (dto.ends_at !== undefined) updates.ends_at = dto.ends_at

  const { data, error } = await supabase
    .from('reservations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteReservation(id: string): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
