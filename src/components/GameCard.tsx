import { useState } from "react";
import { format } from "date-fns";
import { ChevronRight, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Game } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { currentBet, setCurrentBet } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [betAmount, setBetAmount] = useState(game.minBet ?? 1); // 🛡 Default to 1 if minBet missing
  
  const isSelected = currentBet?.gameId === game.id;
  const startTime = new Date(game.startTime);
  const isLive = game.status === "live";

  const handleSelectParticipant = (participantId: string) => {
    setCurrentBet({
      gameId: game.id,
      selectedParticipantId: participantId,
      amount: betAmount,
    });
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;

    const clampedAmount = Math.max(game.minBet, Math.min(game.maxBet, value));
    setBetAmount(clampedAmount);

    if (isSelected) {
      setCurrentBet((prevBet) => ({
        ...prevBet,
        amount: clampedAmount,
      }));
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 bg-card/70 backdrop-blur-sm border-white/10 hover:border-white/20",
      isExpanded && "shadow-lg shadow-blue-500/5"
    )}>
      <div 
        className="relative cursor-pointer group" 
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10" />
        <img 
          src={game.image ?? "/placeholder.jpg"} 
          alt={game.title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 z-20">
          <Badge variant={isLive ? "destructive" : "secondary"} className="text-xs font-medium">
            {isLive ? "LIVE" : "UPCOMING"}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">{game.title}</h3>
          <p className="text-xs text-gray-300 mt-1">{game.description}</p>
        </div>
      </div>

      <CardHeader className="p-4 flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {isLive 
              ? `Started at ${format(startTime, "HH:mm")}` 
              : `Starts ${format(startTime, "MMM d, HH:mm")}`}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsExpanded((prev) => !prev)}
          className="h-6 w-6"
        >
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "rotate-90"
          )} />
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {game.participants.map((participant) => (
              <Button
                key={participant.id}
                variant={currentBet.selectedParticipantId === participant.id && isSelected ? "default" : "outline"}
                className={cn(
                  "justify-between group h-auto py-3 border-white/10",
                  currentBet.selectedParticipantId === participant.id && isSelected && "bg-blue-600 text-white"
                )}
                onClick={() => handleSelectParticipant(participant.id)}
              >
                <span className="text-sm font-medium">{participant.name}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2 bg-muted transition-colors",
                    currentBet.selectedParticipantId === participant.id && isSelected ? "bg-blue-700 text-white" : ""
                  )}
                >
                  {game.odds?.[participant.id]?.toFixed(2) ?? "1.00"}
                </Badge>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={`bet-amount-${game.id}`} className="text-xs font-medium">
                Bet Amount
              </label>
              <span className="text-xs text-muted-foreground">
                Min: {game.minBet} / Max: {game.maxBet}
              </span>
            </div>
            <input
              id={`bet-amount-${game.id}`}
              type="number"
              min={game.minBet}
              max={game.maxBet}
              value={betAmount}
              onChange={handleBetAmountChange}
              className="w-full h-9 px-3 rounded-md bg-muted/50 border border-white/10 text-sm"
            />
          </div>

          {isSelected && currentBet.selectedParticipantId && (
            <div className="bg-muted/30 p-3 rounded-md border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium">Potential Win:</p>
                  <p className="text-lg font-bold text-blue-400">
                    {(betAmount * (game.odds?.[currentBet.selectedParticipantId] ?? 1)).toFixed(0)} points
                  </p>
                </div>
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
