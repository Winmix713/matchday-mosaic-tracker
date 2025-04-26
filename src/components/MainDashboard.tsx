import { useMemo, useState } from "react";
import { Flame, Clock, Trophy, Gamepad2, TrendingUp, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import GameCard from "./GameCard";
import RecentWinners from "./RecentWinners";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Category configurations for better maintainability
const CATEGORIES = [
  { id: "all", label: "All", icon: null },
  { id: "live", label: "Live", icon: Flame },
  { id: "upcoming", label: "Upcoming", icon: Clock },
  { id: "sport", label: "Sports", icon: Trophy },
  { id: "esport", label: "eSports", icon: Gamepad2 },
];

// Helper component for empty states
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-white/10 bg-white/5">
    <Info className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
    <p className="text-muted-foreground">{message}</p>
  </div>
);

// Game grid without animation
const GameGrid = ({ games }) => {
  if (!games.length) {
    return <EmptyState message="No games found in this category" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {games.map((game) => (
        <div 
          key={game.id}
          className="opacity-100 transition-all duration-300 hover:translate-y-1"
        >
          <GameCard game={game} />
        </div>
      ))}
    </div>
  );
};

// Welcome bonus card as a separate component
const WelcomeBonus = () => (
  <Card className="relative overflow-hidden border border-white/10">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/20" />
    <div className="relative z-10 p-6">
      <h3 className="text-lg font-bold mb-2">Welcome Bonus</h3>
      <p className="text-sm text-muted-foreground mb-4">
        New to WinMix? Get 500 bonus points on your first deposit!
      </p>
      <Button 
        className="bg-blue-600 hover:bg-blue-700 transition-colors"
        size="sm"
      >
        Claim Bonus
      </Button>
    </div>
  </Card>
);

export default function MainDashboard() {
  const { games = [] } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Memoize filtered results to avoid unnecessary recalculations
  const { filteredGames, liveGamesCount, upcomingGamesCount } = useMemo(() => {
    const liveGames = games.filter((game) => game.status === "live");
    const upcomingGames = games.filter((game) => game.status === "upcoming");

    const filtered = selectedCategory === "all"
      ? games
      : games.filter((game) => {
          if (selectedCategory === "live") return game.status === "live";
          if (selectedCategory === "upcoming") return game.status === "upcoming";
          return game.category === selectedCategory;
        });

    return {
      filteredGames: filtered,
      liveGamesCount: liveGames.length,
      upcomingGamesCount: upcomingGames.length
    };
  }, [games, selectedCategory]);

  return (
    <main className="flex-1 py-12 md:py-16 lg:py-20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Games</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-blue-600/20 text-blue-400">
                          {liveGamesCount} Live
                        </Badge>
                        <Badge variant="outline" className="bg-muted/30">
                          {upcomingGamesCount} Upcoming
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Current status of game availability
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Tabs defaultValue="all" className="mb-6">
                <TabsList className="grid grid-cols-3 sm:grid-cols-5 h-auto p-1 bg-muted/30 backdrop-blur-md">
                  {CATEGORIES.map(({ id, label, icon: Icon }) => (
                    <TabsTrigger
                      key={id}
                      value={id}
                      onClick={() => setSelectedCategory(id)}
                      className="text-xs py-2 data-[state=active]:bg-blue-600"
                    >
                      {Icon && <Icon className="h-3 w-3 mr-1" />}
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {CATEGORIES.map(({ id }) => (
                  <TabsContent key={id} value={id} className="mt-3">
                    <GameGrid games={filteredGames} />
                  </TabsContent>
                ))}
              </Tabs>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-muted/10 p-4 rounded-lg border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight">Top Winners</h2>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
              <RecentWinners />
            </section>

            <WelcomeBonus />

            <section className="bg-muted/10 p-4 rounded-lg border border-white/5">
              <h2 className="text-xl font-bold tracking-tight mb-4">Active Tournaments</h2>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div 
                    key={i} 
                    className="p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">Weekly Championship {i}</h3>
                      <p className="text-xs text-muted-foreground">Prize pool: $10,000</p>
                    </div>
                    <Badge>Ongoing</Badge>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}