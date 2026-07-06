export interface Reservation {
    id: string
    room_id: string
    reservation_name: string
    participant_name: string
    participants_count: number
    starts_at: string
    ends_at: string
}

export interface CreateReservationDTO {
    room_id: string
    reservation_name: string
    participant_name: string
    participants_count: number
    starts_at: string
    ends_at: string
}

export interface UpdateReservationDTO extends Partial<CreateReservationDTO> { }

export type ReservationStatus =
    |"agendada"
    |"ocorrendo"
    |"finalizada"

export type ConflictResult =
  | { hasConflict: false }
  | { hasConflict: true; reservation: Reservation; roomName: string }

export interface ListReservationsFilters {
  roomId?: string
  startDate?: string
  endDate?: string
  status?: ReservationStatus
  orderBy?: 'starts_at' | 'ends_at' | 'created_at'
  orderDirection?: 'asc' | 'desc'
}

export type ReservationWithRoom = Reservation & { room_name: string; created_at: string }