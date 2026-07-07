import { ChevronRight, User } from "lucide-react"
import { cn } from "../../lib/utils"
import { useReservationStatus, formatTimeRange } from "../../hooks/useReservationStatus"
import type { ReservationWithRoom } from "../../types/reservation"

interface ReservationItemProps {
  reservation: ReservationWithRoom
  onClick?: () => void
}

export function ReservationItem({ reservation, onClick }: ReservationItemProps) {
  const status = useReservationStatus(reservation.starts_at, reservation.ends_at)
  const timeLabel = formatTimeRange(reservation.starts_at, reservation.ends_at)

  const statusColor =
    status === "ocorrendo"
      ? "text-green-600"
      : status === "agendada"
        ? "text-blue-600"
        : "text-outline"

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-surface p-card-padding rounded-xl shadow-sm border border-transparent",
        "hover:border-primary/20 transition-all cursor-pointer",
        "flex justify-between items-center card-hover-effect"
      )}
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
    >
      <div className="flex flex-col gap-1">
        <span className={`font-label-bold text-label-bold uppercase tracking-wider ${statusColor}`}>
          {timeLabel}
          {status === "ocorrendo" && (
            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </span>
        <h3 className="font-headline-md text-headline-md text-on-surface">
          {reservation.reservation_name}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
          <User size={16} />
          {reservation.participant_name} · {reservation.participants_count} participantes
        </p>
      </div>
      <ChevronRight size={20} className="text-outline shrink-0" />
    </div>
  )
}
