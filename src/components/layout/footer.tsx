import { LayoutGrid, CalendarDays, User } from "lucide-react"

interface FooterProps {
  activeTab?: "rooms" | "calendar" | "profile"
  onTabChange?: (tab: "rooms" | "calendar" | "profile") => void
}

export function Footer({ activeTab = "rooms", onTabChange }: FooterProps) {
  const tabs = [
    {
      id: "rooms" as const,
      label: "Salas",
      icon: LayoutGrid,
    },
    {
      id: "calendar" as const,
      label: "Calendário",
      icon: CalendarDays,
    },
    {
      id: "profile" as const,
      label: "Perfil",
      icon: User,
    },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile py-2 pb-safe bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`flex flex-col items-center justify-center active:scale-90 transition-all duration-150 ${
              isActive
                ? "bg-secondary-container text-on-secondary-container rounded-full px-4 py-1"
                : "text-on-surface-variant hover:opacity-80"
            }`}
          >
            <Icon className={isActive ? "fill-icon" : ""} size={24} />
            <span className="font-label-md text-[10px]">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
