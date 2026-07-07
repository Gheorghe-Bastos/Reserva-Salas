import { ArrowLeft, DoorOpen } from "lucide-react"
import { Avatar } from "../ui/avatar"
import { Button } from "../ui/button"

interface HeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
}

export function Header({ title, showBack, onBack }: HeaderProps) {
  return (
    <div className="flex justify-center items-center w-full">
      <header className="flex justify-center items-center fixed top-0 w-full z-50 bg-surface shadow-sm h-16 flex justify-between items-center px-gutter">
        <div className="flex items-center justify-around w-full gap-3">
          <div className="flex items-center gap-3">
            {showBack ? (
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="text-primary" />
              </Button>
            ) : (
              <DoorOpen className="text-primary" />
            )}
            <h1 className="font-headline-md text-headline-md font-bold text-primary">
              {title}
            </h1>
          </div>
          <Avatar
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8k5zoBSyl5_G_O3WmvWRLstHqlmAuDHYpYq3VJJFM2otWM8BvLgAgEktQM950oJj4eK9aQw6xQMok68d5mVVglb9IxmLEZ50uPUf4ct0XefVmof0O4RQG9p9zrN_rNmUjRQLkxLpc4ga4lP4ORbDkaxxe2uTkjjl74jsQyPnU4HAxume-63YbWS9ILVxZgW27dj3IyPilTztlCuHW4XEzekrcdPXOI_p9DoR6pyVajXGzNqZTrD8PmLdxTsBl8KRRc7AkK1Wg5f14"
            alt="Lucas Silva"
            fallback="LS"
          />
        </div>
      </header>
    </div>
  )
}
