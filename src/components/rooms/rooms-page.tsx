import { AlertCircle } from "lucide-react"
import { Header } from "../layout/header"
import { Footer } from "../layout/footer"
import { RoomCard } from "./room-card"
import { useRooms } from "../../hooks/useRooms"
import type { Room } from "../../types/room"

interface RoomsPageProps {
  onNavigate?: (room: Room) => void
}

export function RoomsPage({ onNavigate }: RoomsPageProps) {
  const { rooms, loading, error } = useRooms()

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
      </main>

      <Footer activeTab="rooms" />
    </div>
  )
}
