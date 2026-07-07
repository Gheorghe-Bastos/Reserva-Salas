import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom"
import { RoomsPage } from "./components/rooms/rooms-page"
import { ReservationsPage } from "./components/reservation/reservations-page"
import type { Room } from "./types/room"

function HomePage() {
  const navigate = useNavigate()

  function handleRoomSelect(room: Room) {
    navigate(`/reservations/${encodeURIComponent(room.name)}`)
  }

  return <RoomsPage onNavigate={handleRoomSelect} />
}

function ReservationsRoute() {
  const navigate = useNavigate()
  const { roomName } = useParams<{ roomName: string }>()

  function handleBack() {
    navigate("/")
  }

  return <ReservationsPage roomName={roomName ?? "Sala"} onBack={handleBack} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservations/:roomName" element={<ReservationsRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
