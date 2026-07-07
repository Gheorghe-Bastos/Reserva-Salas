import { useState, useMemo } from "react"
import { AlertCircle, Clock, DoorOpen } from "lucide-react"
import { Header } from "../layout/header"
import { Footer } from "../layout/footer"
import { RoomCard } from "./room-card"
import { ReservationItem } from "../reservation/reservation-item"
import { useRooms } from "../../hooks/useRooms"
import { useReservations } from "../../hooks/useReservations"
import { useNow, getStatus } from "../../hooks/useReservationStatus"
import type { Room } from "../../types/room"

interface RoomsPageProps {
  onNavigate?: (room: Room) => void
}

export function RoomsPage({ onNavigate }: RoomsPageProps) {
  const { rooms, loading, error } = useRooms()
  const { reservations: allReservations, loading: loadingAll } = useReservations()
  const now = useNow()

  const [todayRoomFilter, setTodayRoomFilter] = useState<string>("")

  const { ongoing, upcoming, finished } = useMemo(() => {
    const todayStr = now.toISOString().split("T")[0]
    const today = allReservations
      .filter((r) => r.starts_at.startsWith(todayStr))
      .filter((r) => !todayRoomFilter || r.room_id === todayRoomFilter)

    const ongoing: typeof today = []
    const upcoming: typeof today = []
    const finished: typeof today = []

    for (const r of today) {
      const status = getStatus(r.starts_at, r.ends_at, now)
      if (status === "ocorrendo") ongoing.push(r)
      else if (status === "agendada") upcoming.push(r)
      else finished.push(r)
    }

    const sort = (list: typeof today) =>
      [...list].sort(
        (a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
      )

    return {
      ongoing: sort(ongoing),
      upcoming: sort(upcoming),
      finished: sort(finished),
    }
  }, [allReservations, todayRoomFilter, now])

  return (
    <div className="bg-background text-on-surface min-h-screen pb-24 md:pb-0 md:pt-16">
      <Header title="ReserveSuíte" />

      <main className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-8">
        <header className="mb-8">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
            Selecione uma Sala
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Escolha o ambiente ideal para sua próxima reunião produtiva.
          </p>
        </header>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 mb-6">
            <AlertCircle size={20} />
            <p className="font-body-md text-body-md">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-container-lowest rounded-xl p-card-padding animate-pulse h-48"
              />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body-lg text-body-lg text-outline">
              Nenhuma sala disponível
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onReserve={onNavigate}
              />
            ))}
          </div>
        )}

        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Reservas de Hoje
              </h2>
            </div>
            <div className="relative">
              <select
                value={todayRoomFilter}
                onChange={(e) => setTodayRoomFilter(e.target.value)}
                className="appearance-none bg-surface border border-outline-variant rounded-lg px-3 py-2 font-label-md text-label-md text-on-surface cursor-pointer pr-8"
              >
                <option value="">Todas as salas</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <DoorOpen
                size={16}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
              />
            </div>
          </div>

          {loadingAll ? (
            <div className="space-y-stack-gap">
              <div className="bg-surface p-card-padding rounded-xl animate-pulse h-20" />
              <div className="bg-surface p-card-padding rounded-xl animate-pulse h-20" />
              <div className="bg-surface p-card-padding rounded-xl animate-pulse h-20" />
            </div>
          ) : (
            <div className="space-y-gutter">
              {ongoing.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      Em andamento agora
                    </h3>
                    <span className="font-label-md text-label-md text-outline ml-auto">
                      {ongoing.length}
                    </span>
                  </div>
                  <div className="space-y-stack-gap">
                    {ongoing.map((r) => (
                      <ReservationItem
                        key={r.id}
                        reservation={r}
                        onClick={() =>
                          onNavigate?.(
                            rooms.find((room) => room.id === r.room_id) ??
                              rooms[0]
                          )
                        }
                      />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-blue-500" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Próximas
                  </h3>
                  <span className="font-label-md text-label-md text-outline ml-auto">
                    {upcoming.length}
                  </span>
                </div>
                {upcoming.length === 0 ? (
                  <p className="font-body-md text-body-md text-outline text-center py-6">
                    Nenhuma próxima reserva
                  </p>
                ) : (
                  <div className="space-y-stack-gap">
                    {upcoming.map((r) => (
                      <ReservationItem
                        key={r.id}
                        reservation={r}
                        onClick={() =>
                          onNavigate?.(
                            rooms.find((room) => room.id === r.room_id) ??
                              rooms[0]
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-outline" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Encerradas
                  </h3>
                  <span className="font-label-md text-label-md text-outline ml-auto">
                    {finished.length}
                  </span>
                </div>
                {finished.length === 0 ? (
                  <p className="font-body-md text-body-md text-outline text-center py-6">
                    Nenhuma reserva encerrada
                  </p>
                ) : (
                  <div className="space-y-stack-gap">
                    {finished.map((r) => (
                      <ReservationItem
                        key={r.id}
                        reservation={r}
                        onClick={() =>
                          onNavigate?.(
                            rooms.find((room) => room.id === r.room_id) ??
                              rooms[0]
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </main>

      <Footer activeTab="rooms" />
    </div>
  )
}
