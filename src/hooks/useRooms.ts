import { useState } from "react"
import type { Room } from "../types/room"

const mockRooms: Room[] = [
  { id: "0bd90993-294a-43b3-aa49-9e162adc9a8d", name: "Sala Ártico", capacity: 8, created_at: "" },
  { id: "da92631d-49f9-4a6f-96c3-4aa483d24de0", name: "Sala Andes", capacity: 4, created_at: "" },
  { id: "08995551-93f0-4220-a064-b29e47377cb7", name: "Sala Amazônia", capacity: 30, created_at: "" },
  { id: "e33ea11b-a89a-4b01-a0b0-453f45317cd8", name: "Sala Pacífico", capacity: 15, created_at: "" },
  { id: "c9b052a4-40e7-43f6-827e-1be560ed201e", name: "Sala Saara", capacity: 2, created_at: "" },
]

export function useRooms() {
  const [rooms] = useState<Room[]>(mockRooms)

  return {
    rooms,
    loading: false,
    error: null,
    refresh: () => {},
  }
}
