
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LeagueData } from "./types";
import { processLeagueData } from "./calculations";
import Header from "./components/Header";
import LeagueTable from "./components/LeagueTable";
import LeagueDetails from "./components/LeagueDetails";
import NewLeagueModal from "./components/NewLeagueModal";
import { toast } from "@/hooks/use-toast";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Sample initial data - in a real app, this would come from an API
  const [leagues, setLeagues] = useState<LeagueData[]>([
    {
      id: "1",
      name: "Premier League",
      country: "England",
      season: "2023-2024",
      matches: [
        {
          id: "1",
          round: 1,
          date: "2023-08-12",
          homeTeam: "Manchester United",
          awayTeam: "Chelsea",
          homeGoals: 2,
          awayGoals: 1,
          played: true
        },
        {
          id: "2",
          round: 1,
          date: "2023-08-12",
          homeTeam: "Arsenal",
          awayTeam: "Liverpool",
          homeGoals: 2,
          awayGoals: 2,
          played: true
        },
        {
          id: "3",
          round: 2,
          date: "2023-08-19",
          homeTeam: "Chelsea",
          awayTeam: "Arsenal",
          homeGoals: 1,
          awayGoals: 3,
          played: true
        },
        {
          id: "4",
          round: 2,
          date: "2023-08-19",
          homeTeam: "Liverpool",
          awayTeam: "Manchester United",
          homeGoals: 2,
          awayGoals: 0,
          played: true
        },
        {
          id: "5",
          round: 3,
          date: "2023-08-26",
          homeTeam: "Manchester United",
          awayTeam: "Arsenal",
          homeGoals: 1,
          awayGoals: 1,
          played: true
        },
        {
          id: "6",
          round: 3,
          date: "2023-08-26",
          homeTeam: "Chelsea",
          awayTeam: "Liverpool",
          homeGoals: 0,
          awayGoals: 3,
          played: true
        }
      ]
    }
  ].map(processLeagueData));

  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeague, setEditingLeague] = useState<LeagueData | null>(null);

  const selectedLeague = leagues.find(league => league.id === selectedLeagueId);

  const handleViewLeague = (id: string) => {
    setSelectedLeagueId(id);
  };

  const handleEditLeague = (id: string) => {
    const league = leagues.find(l => l.id === id);
    if (league) {
      setEditingLeague(league);
      setIsModalOpen(true);
    }
  };

  const handleDeleteLeague = (id: string) => {
    setLeagues(leagues.filter(league => league.id !== id));
    toast({
      title: "League deleted",
      description: "The league has been deleted successfully.",
    });
  };

  const handleAddLeague = () => {
    setEditingLeague(null);
    setIsModalOpen(true);
  };

  const handleLeagueSubmit = (data: { name: string; country: string; season: string }) => {
    if (editingLeague) {
      // Update existing league
      setLeagues(
        leagues.map(league =>
          league.id === editingLeague.id
            ? processLeagueData({ ...league, ...data })
            : league
        )
      );
      toast({
        title: "League updated",
        description: "The league has been updated successfully.",
      });
    } else {
      // Add new league
      const newLeague: LeagueData = {
        id: uuidv4(),
        name: data.name,
        country: data.country,
        season: data.season,
        matches: []
      };
      setLeagues([...leagues, processLeagueData(newLeague)]);
      toast({
        title: "League created",
        description: "The new league has been created successfully.",
      });
    }
  };

  const MainView = () => (
    <>
      <Header
        title="Soccer Championship Manager"
        subtitle="Manage your leagues and competitions"
        onAddLeague={handleAddLeague}
      />
      
      <main className="container mx-auto p-4">
        {selectedLeague ? (
          <LeagueDetails
            league={selectedLeague}
            onBack={() => setSelectedLeagueId(null)}
          />
        ) : (
          <LeagueTable
            leagues={leagues}
            onViewLeague={handleViewLeague}
            onEditLeague={handleEditLeague}
            onDeleteLeague={handleDeleteLeague}
          />
        )}
      </main>
      
      <NewLeagueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleLeagueSubmit}
        initialData={editingLeague ? {
          name: editingLeague.name,
          country: editingLeague.country,
          season: editingLeague.season
        } : undefined}
        title={editingLeague ? "Edit League" : "Add New League"}
      />
    </>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900 text-white">
            <Routes>
              <Route path="/" element={<MainView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
