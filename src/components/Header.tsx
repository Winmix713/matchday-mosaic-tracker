import { useEffect, useState } from "react"
import { Trophy, Bell, User, ChevronDown, X, MoonStar, Sun } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Notification } from "@/lib/types"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const NotificationItem = ({ notification, onRead }: { notification: Notification; onRead: (id: string) => void }) => {
  const timestamp = new Date(notification.timestamp)
  const timeAgo = Math.floor((Date.now() - timestamp.getTime()) / 1000 / 60)
  
  return (
    <div className={cn(
      "p-3 border-b last:border-b-0 border-border/50 flex items-start gap-3 hover:bg-muted/50 transition-colors",
      !notification.read && "bg-muted/30"
    )}>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-primary">{notification.title}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
        <span className="text-xs text-muted-foreground/70 mt-1">{timeAgo} minutes ago</span>
      </div>
      {!notification.read && (
        <button
          onClick={() => onRead(notification.id)}
          className="p-1 hover:bg-muted rounded-full transition-colors"
        >
          <X className="h-3 w-3 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}

const Header = () => {
  const { userStats, markNotificationAsRead, isDarkMode, toggleDarkMode } = useAppStore()
  const [scrolled, setScrolled] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const unreadNotifications = userStats.notifications.filter(n => !n.read).length

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b backdrop-blur-lg",
        scrolled ? "bg-background/70 border-white/10 py-3" : "bg-transparent border-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div
          className={cn(
            "flex items-center transition-all duration-500",
            animationComplete ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
          )}
        >
          <div className="mr-2 h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5">
            <div className="h-full w-full rounded-md bg-background flex items-center justify-center">
              <Trophy className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-primary">
            Win<span className="text-blue-400">Mix.hu</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "hidden md:flex items-center gap-3 transition-all duration-500 delay-100",
              animationComplete ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            )}
          >
            <div className="px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors duration-200 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium text-primary">{userStats.points} Points</span>
            </div>

            <div className="px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors duration-200">
              <span className="text-xs font-medium text-primary">{userStats.winRate}% Win Rate</span>
            </div>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 transition-all duration-500 delay-200",
              animationComplete ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            )}
          >
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-muted/50 hover:bg-muted/80 transition-colors duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <MoonStar className="h-4 w-4 text-primary" />
              )}
            </button>
            
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 rounded-full bg-muted/50 hover:bg-muted/80 transition-colors duration-200">
                  <Bell className="h-4 w-4 text-primary" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-background/95 backdrop-blur-lg border-white/10">
                <div className="p-3 border-b border-border/50">
                  <h3 className="text-sm font-medium text-primary">Notifications</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {userStats.notifications.length > 0 ? (
                    userStats.notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={markNotificationAsRead}
                      />
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">No notifications</p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors duration-200">
              <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-medium text-primary">Profile</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground opacity-60" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header