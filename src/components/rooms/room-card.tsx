import { Users, Wifi, Tv, Video, PenTool, Coffee, Lock, Mic, Presentation, Info } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import type { Room } from "../../types/room"

interface RoomCardProps {
  room: Room
  onReserve?: (room: Room) => void
  onInfo?: (room: Room) => void
}

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  tv: Tv,
  videocam: Video,
  draw: PenTool,
  coffee: Coffee,
  lock: Lock,
  mic: Mic,
  present_to_all: Presentation,
}

const roomAmenities: Record<string, { icon: string; title: string }[]> = {
  "Sala Ártico": [
    { icon: "wifi", title: "Wi-Fi" },
    { icon: "tv", title: "Monitor/TV" },
  ],
  "Sala Pacífico": [
    { icon: "videocam", title: "Videoconferência" },
    { icon: "wifi", title: "Wi-Fi" },
  ],
  "Sala Andes": [
    { icon: "draw", title: "Lousa" },
  ],
  "Sala Saara": [
    { icon: "coffee", title: "Café" },
    { icon: "lock", title: "Privativa" },
  ],
  "Sala Amazônia": [
    { icon: "mic", title: "Áudio Premium" },
    { icon: "present_to_all", title: "Projetor" },
  ],
}

export function RoomCard({ room, onReserve, onInfo }: RoomCardProps) {
  const amenities = roomAmenities[room.name] ?? []
  const capacityLabel = `${room.capacity} ${room.capacity === 1 ? "pessoa" : "pessoas"}`
  const isUnavailable = room.name === "Sala Pacífico"

  return (
    <Card className="hover:border-primary/20 hover:shadow-lg group overflow-hidden flex flex-col">
      <CardContent className="flex flex-col flex-grow p-card-padding">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-1">
              {room.name}
            </h3>

          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <Users size={16} />
            <span className="font-label-md text-label-md">{capacityLabel}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 flex gap-3">
          {isUnavailable ? (
            <Button
              variant="outline"
              className="flex-grow bg-surface-variant text-on-surface-variant/50 cursor-not-allowed"
              disabled
            >
              INDISPONÍVEL
            </Button>
          ) : (
            <Button
              className="flex-grow"
              onClick={() => onReserve?.(room)}
            >
              RESERVAR AGORA
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
