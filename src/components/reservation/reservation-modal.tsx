import { useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import type { ReservationWithRoom } from "../../types/reservation"

interface ReservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reservation?: ReservationWithRoom | null
  roomId: string
  onCreate?: (data: {
    reservation_name: string
    participant_name: string
    participants_count: number
    room_id: string
    starts_at: string
    ends_at: string
  }) => Promise<string | null>
  onUpdate?: (id: string, data: {
    reservation_name?: string
    participant_name?: string
    participants_count?: number
    room_id?: string
    starts_at?: string
    ends_at?: string
  }) => Promise<string | null>
  onDelete?: (id: string) => Promise<string | null>
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

function ReservationForm({
  reservation,
  roomId,
  onCreate,
  onUpdate,
  onDelete,
  onSuccess,
}: {
  reservation?: ReservationWithRoom | null
  roomId: string
  onCreate?: ReservationModalProps["onCreate"]
  onUpdate?: ReservationModalProps["onUpdate"]
  onDelete?: ReservationModalProps["onDelete"]
  onSuccess: () => void
}) {
  const isEdit = !!reservation
  const [reservationName, setReservationName] = useState(
    reservation?.reservation_name ?? ""
  )
  const [participantName, setParticipantName] = useState(
    reservation?.participant_name ?? ""
  )
  const [participantsCount, setParticipantsCount] = useState(
    reservation ? String(reservation.participants_count) : ""
  )
  const [start, setStart] = useState(
    reservation ? fmtTime(reservation.starts_at) : ""
  )
  const [end, setEnd] = useState(
    reservation ? fmtTime(reservation.ends_at) : ""
  )
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  function validate(): boolean {
    const errors: Record<string, string> = {}
    if (!reservationName.trim()) errors.reservation_name = "Nome da reserva é obrigatório"
    if (!participantName.trim()) errors.participant_name = "Nome do responsável é obrigatório"
    if (!participantsCount.trim() || Number(participantsCount) < 1)
      errors.participants_count = "Quantidade mínima é 1"
    if (!start) errors.starts_at = "Horário de início é obrigatório"
    if (!end) errors.ends_at = "Horário de término é obrigatório"
    if (start && end && start >= end)
      errors.ends_at = "Término deve ser após o início"
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setError(null)

    const today = new Date().toISOString().split("T")[0]
    const dto = {
      reservation_name: reservationName.trim(),
      participant_name: participantName.trim(),
      participants_count: Number(participantsCount),
      room_id: roomId,
      starts_at: `${today}T${start}:00`,
      ends_at: `${today}T${end}:00`,
    }

    const errMsg = isEdit
      ? await onUpdate?.(reservation!.id, dto)
      : await onCreate?.(dto)

    if (errMsg) {
      setError(errMsg)
      setSaving(false)
    } else {
      onSuccess()
    }
  }

  async function handleDelete() {
    if (!reservation) return
    setSaving(true)
    const errMsg = await onDelete?.(reservation.id)
    if (errMsg) {
      setError(errMsg)
      setSaving(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-gutter">
      {error && (
        <div className="bg-error-container text-on-error-container p-3 rounded-lg font-body-sm text-body-sm mb-4">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="inputReservationName">Nome da Reserva</Label>
        <Input
          id="inputReservationName"
          placeholder="Ex: Reunião de alinhamento"
          value={reservationName}
          onChange={(e) => setReservationName(e.target.value)}
        />
        {fieldErrors.reservation_name && (
          <p className="text-error text-body-xs mt-1">{fieldErrors.reservation_name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="inputParticipantName">Nome do Responsável</Label>
        <Input
          id="inputParticipantName"
          placeholder="Digite o nome do responsável"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
        />
        {fieldErrors.participant_name && (
          <p className="text-error text-body-xs mt-1">{fieldErrors.participant_name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="inputParticipantsCount">Quantidade de Participantes</Label>
        <Input
          id="inputParticipantsCount"
          type="number"
          min="1"
          placeholder="Ex: 5"
          value={participantsCount}
          onChange={(e) => setParticipantsCount(e.target.value)}
        />
        {fieldErrors.participants_count && (
          <p className="text-error text-body-xs mt-1">{fieldErrors.participants_count}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-gutter">
        <div>
          <Label htmlFor="inputStart">Início</Label>
          <Input
            id="inputStart"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          {fieldErrors.starts_at && (
            <p className="text-error text-body-xs mt-1">{fieldErrors.starts_at}</p>
          )}
        </div>
        <div>
          <Label htmlFor="inputEnd">Fim</Label>
          <Input
            id="inputEnd"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
          {fieldErrors.ends_at && (
            <p className="text-error text-body-xs mt-1">{fieldErrors.ends_at}</p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Salvando..." : "Salvar Reserva"}
        </Button>
        {isEdit && (
          <Button
            type="button"
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleDelete}
            disabled={saving}
          >
            Excluir Reserva
          </Button>
        )}
      </DialogFooter>
    </form>
  )
}

export function ReservationModal({
  open,
  onOpenChange,
  reservation,
  roomId,
  onCreate,
  onUpdate,
  onDelete,
}: ReservationModalProps) {
  const isEdit = !!reservation

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto mb-6 md:hidden" />

        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Reserva" : "Nova Reserva"}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-outline hover:text-on-surface"
          >
            <X size={20} />
          </Button>
        </DialogHeader>

        <ReservationForm
          key={isEdit ? reservation!.id : "new"}
          reservation={reservation}
          roomId={roomId}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
