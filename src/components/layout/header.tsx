import { ArrowLeft, DoorOpen } from "lucide-react"
import { Button } from "../ui/button"

interface HeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
}

export function Header({ title, showBack, onBack }: HeaderProps) {
  return (
    <div className="flex justify-center items-center w-full">
      <header className="fixed top-0 w-full z-50 bg-surface shadow-sm h-16 flex justify-between items-center px-gutter">
        <div className="flex items-center justify-around w-full gap-3">
          <div className="flex items-center gap-3">
            {showBack ? (
              <Button variant="outline" size="icon" onClick={onBack}>
                <ArrowLeft className="text-primary" />
              </Button>
            ) : (
              <DoorOpen className="text-primary" />
            )}
            <h1 className="font-headline-md text-xl text-headline-md font-bold text-primary">
              {title}
            </h1>
          </div>
        </div>
      </header>
    </div>
  )
}
