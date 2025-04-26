import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RecentWinners() {
  const { recentWinners = [] } = useAppStore(); // ✅ Default to empty array
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (recentWinners.length === 0) return; // ✅ Guard if empty

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % recentWinners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [recentWinners.length]);

  if (!Array.isArray(recentWinners) || recentWinners.length === 0) {
    return (
      <Card className="border-white/10">
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground text-sm">No recent winners</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card className="border-white/10 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500">
          <div 
            className="h-full bg-white/30 transition-all duration-300 ease-in-out"
            style={{ 
              width: `${(activeIndex / (recentWinners.length - 1)) * 100}%` 
            }}
          />
        </div>

        <CardContent className="p-4 pt-5">
          {recentWinners.map((winner, index) => (
            <div
              key={winner.id}
              className={cn(
                "transition-all duration-500 absolute inset-x-0 px-4 pt-5 pb-4",
                activeIndex === index 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8 pointer-events-none"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {winner.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-sm">{winner.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(winner.timestamp), "HH:mm")}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-md bg-muted/30 border border-white/10">
                <p className="text-xs text-muted-foreground mb-1">
                  Won on <span className="text-primary">{winner.gameTitle}</span>
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {winner.amount} points
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-base font-bold text-blue-400">
                    {winner.winningAmount} points
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-1">
        {recentWinners.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              activeIndex === index 
                ? "w-4 bg-blue-500" 
                : "w-1.5 bg-muted"
            )}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
