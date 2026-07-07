import { Users } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import type { Room } from "../../types/room"

interface RoomCardProps {
  room: Room
  onReserve?: (room: Room) => void
}

export function RoomCard({ room, onReserve }: RoomCardProps) {
  const capacityLabel = `${room.capacity} ${room.capacity === 1 ? "pessoa" : "pessoas"}`
  const isUnavailable = room.name === "Sala Pacífico"

  return (
    <Card className="hover:border-primary/20 hover:shadow-lg group overflow-hidden flex flex-col">
      <CardContent className="flex flex-col p-card-padding">
        <div className="flex justify-between items-start mb-3 mt-2">
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
              className="flex-grow cursor-pointer bg-surface-variant text-on-surface-variant/50 cursor-not-allowed"
              disabled
            >
              INDISPONÍVEL
            </Button>
          ) : (
            <Button
              className="flex-grow cursor-pointer"
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
