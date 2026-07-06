export interface Room {
    id: string
    name: string
    capacity: number
    created_at: string
}

export interface CreateRoomDTO {
    name: string
    capacity: number
}

export interface UpdateRoomDTO extends Partial<CreateRoomDTO> { }