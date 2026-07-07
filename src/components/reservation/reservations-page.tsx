import { useState, useMemo, useCallback } from "react"
import { Plus, DoorOpen, Clock, AlertCircle } from "lucide-react"
import { Header } from "../layout/header"
import { Footer } from "../layout/footer"
import { Button } from "../ui/button"
import { ReservationItem } from "./reservation-item"
import { ReservationModal } from "./reservation-modal"
import { useRooms } from "../../hooks/useRooms"
import { useReservations } from "../../hooks/useReservations"
import { getStatus } from "../../hooks/useReservationStatus"
import type { ReservationWithRoom } from "../../types/reservation"

interface ReservationsPageProps {
  roomName?: string
  onBack?: () => void
}

type SortOrder = "asc" | "desc"

function sortReservations(list: ReservationWithRoom[], order: SortOrder) {
  return [...list].sort((a, b) => {
    const diff = new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
    return order === "asc" ? diff : -diff
  })
}

export function ReservationsPage({ roomName = "Sala Ártico", onBack }: ReservationsPageProps) {
  const { rooms, loading: roomsLoading } = useRooms()
  const room = rooms.find((r) => r.name === roomName)
  const roomId = room?.id ?? ""

  const { reservations, loading, error, create, update, remove } = useReservations(
    roomId ? { roomId } : undefined
  )

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithRoom | null>(null)

  const { ongoing, upcoming, finished } = useMemo(() => {
    const ongoing: ReservationWithRoom[] = []
    const upcoming: ReservationWithRoom[] = []
    const finished: ReservationWithRoom[] = []

    for (const r of reservations) {
      const status = getStatus(r.starts_at, r.ends_at)
      if (status === "ocorrendo") ongoing.push(r)
      else if (status === "agendada") upcoming.push(r)
      else finished.push(r)
    }

    return {
      ongoing: sortReservations(ongoing, sortOrder),
      upcoming: sortReservations(upcoming, sortOrder),
      finished: sortReservations(finished, sortOrder),
    }
  }, [reservations, sortOrder])

  const handleReservationClick = useCallback((reservation: ReservationWithRoom) => {
    setSelectedReservation(reservation)
    setModalOpen(true)
  }, [])

  const handleNewReservation = useCallback(() => {
    setSelectedReservation(null)
    setModalOpen(true)
  }, [])

  const handleCreate = useCallback(
    async (data: Parameters<typeof create>[0]) => create(data),
    [create]
  )

  const handleUpdate = useCallback(
    async (id: string, data: Parameters<typeof update>[1]) => update(id, data),
    [update]
  )

  const handleDelete = useCallback(
    async (id: string) => remove(id),
    [remove]
  )

  function renderSection(
    title: string,
    items: ReservationWithRoom[],
    icon: React.ReactNode
  ) {
    return (
      <section className="mb-gutter">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
          <span className="font-label-md text-label-md text-outline ml-auto">
            {items.length}
          </span>
        </div>
        <div className="space-y-stack-gap">
          {loading ? (
            <>
              <div className="bg-surface p-card-padding rounded-xl animate-pulse h-20" />
              <div className="bg-surface p-card-padding rounded-xl animate-pulse h-20" />
            </>
          ) : items.length === 0 ? (
            <p className="font-body-md text-body-md text-outline text-center py-6">
              Nenhuma reserva{" "}
              {title.toLowerCase()}
            </p>
          ) : (
            items.map((r) => (
              <ReservationItem
                key={r.id}
                reservation={r}
                onClick={() => handleReservationClick(r)}
              />
            ))
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="bg-background text-on-surface min-h-screen pb-32">
      <Header title={`Reservas - ${roomName}`} showBack onBack={onBack} />

      <main className="mt-20 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl flex items-center gap-2 mb-4">
            <AlertCircle size={18} />
            <p className="font-body-sm text-body-sm">{error}</p>
          </div>
        )}

        <div className="mb-gutter bg-surface-container-low rounded-xl p-card-padding flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary">
              <DoorOpen size={24} />
            </div>
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant">
                {roomsLoading
                  ? "Carregando..."
                  : room
                    ? `Capacidade: ${room.capacity} pessoas`
                    : "Sala não encontrada"}
              </p>
              <p className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                {ongoing.length > 0 ? "Ocupado agora" : "Disponível agora"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="appearance-none bg-surface border border-outline-variant rounded-lg px-3 py-2 font-label-md text-label-md text-on-surface cursor-pointer pr-8"
              >
                <option value="asc">Horário ↑</option>
                <option value="desc">Horário ↓</option>
              </select>
              <Clock
                size={16}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
              />
            </div>
          </div>
        </div>

        {ongoing.length > 0 &&
          renderSection(
            "Em andamento agora",
            ongoing,
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          )}

        {renderSection(
          "Próximas",
          upcoming,
          <Clock size={18} className="text-blue-500" />
        )}

        {renderSection(
          "Encerradas",
          finished,
          <Clock size={18} className="text-outline" />
        )}
      </main>

      <Button
        onClick={handleNewReservation}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg z-40"
        size="icon"
      >
        <Plus size={32} />
      </Button>

      <Footer activeTab="rooms" />

      <ReservationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        reservation={selectedReservation}
        roomId={roomId}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}
