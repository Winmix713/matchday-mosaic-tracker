import { useState, useEffect } from "react";
import { CreditCard, X, AlertTriangle, Clock, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BetSlip() {
  const { currentBet, setCurrentBet, userStats, games, placeBet } = useAppStore();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [sliderValue, setSliderValue] = useState(0);

  const safeGames = games ?? [];
  const selectedGame = safeGames.find((g) => g.id === currentBet?.gameId);
  const selectedParticipant = selectedGame?.participants.find((p) => p.id === currentBet?.selectedParticipantId);

  const odds = selectedGame && selectedParticipant ? selectedGame.odds[selectedParticipant.id] : 0;
  const potentialWin = currentBet?.amount ? currentBet.amount * odds : 0;

  const hasActiveBet = !!selectedGame && !!selectedParticipant;
  const insufficientBalance = currentBet?.amount > (userStats?.points ?? 0);
  const isValidBet = hasActiveBet && currentBet?.amount > 0 && !insufficientBalance;
  const currentBalance = userStats?.points ?? 0;

  // Reset custom amount when drawer opens/closes
  useEffect(() => {
    if (isOpen && currentBet?.amount) {
      setCustomAmount(currentBet.amount.toString());
      setSliderValue(Math.min(100, Math.round((currentBet.amount / currentBalance) * 100)));
    }
  }, [isOpen, currentBet?.amount, currentBalance]);

  // Quick bet amounts (25%, 50%, 75%, MAX)
  const quickBetAmounts = [
    { label: "25%", value: Math.floor(currentBalance * 0.25) },
    { label: "50%", value: Math.floor(currentBalance * 0.5) },
    { label: "75%", value: Math.floor(currentBalance * 0.75) },
    { label: "MAX", value: currentBalance }
  ];

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCustomAmount(value);
      const numValue = parseInt(value || "0", 10);
      
      if (currentBet) {
        setCurrentBet({
          ...currentBet,
          amount: numValue
        });
      }
      
      // Update slider to match
      if (numValue > 0 && currentBalance > 0) {
        setSliderValue(Math.min(100, Math.round((numValue / currentBalance) * 100)));
      } else {
        setSliderValue(0);
      }
    }
  };

  const handleSliderChange = (newValue) => {
    setSliderValue(newValue[0]);
    const betAmount = Math.floor((newValue[0] / 100) * currentBalance);
    setCustomAmount(betAmount.toString());
    
    if (currentBet) {
      setCurrentBet({
        ...currentBet,
        amount: betAmount
      });
    }
  };

  const handleQuickAmount = (amount) => {
    setCustomAmount(amount.toString());
    if (currentBet) {
      setCurrentBet({
        ...currentBet,
        amount
      });
    }
    setSliderValue(Math.min(100, Math.round((amount / currentBalance) * 100)));
  };

  const handlePlaceBet = () => {
    if (!isValidBet) {
      toast({
        title: "Invalid Bet",
        description: insufficientBalance ? 
          "You don't have enough points to place this bet." : 
          "Please select a valid bet and amount.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      try {
        placeBet();
        toast({
          title: "Bet Placed Successfully!",
          description: `You bet ${currentBet.amount} points on ${selectedParticipant?.name}.`,
          variant: "success",
        });
        setIsOpen(false);
      } catch (error) {
        toast({
          title: "Error Placing Bet",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1000);
  };

  const clearBet = () => {
    if (currentBet) {
      setCurrentBet({
        ...currentBet,
        selectedParticipantId: null
      });
    }
    toast({
      title: "Bet Removed",
      description: "Your bet has been removed from the slip.",
    });
  };

  if (!currentBet) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 shadow-lg transition-all hover:shadow-blue-500/20"
          disabled={!hasActiveBet}
          variant={hasActiveBet ? "default" : "secondary"}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Bet Slip</span>
          {hasActiveBet && (
            <Badge variant="outline" className="ml-2 bg-blue-700 transition-all">1</Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <DrawerTitle>Your Bet Slip</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 py-6">
          {hasActiveBet ? (
            <div className="transition-opacity duration-200 ease-in-out opacity-100">
              <Card className="border-white/10 overflow-hidden bg-gradient-to-b from-transparent to-blue-950/20">
                <CardHeader className="p-4 pb-2 flex-row items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{selectedGame?.title}</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="h-5 px-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-[10px]">LIVE</span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Live betting in progress</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedGame?.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearBet}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="bg-white/5 rounded-md p-3 border border-white/10">
                    <DisplayRow 
                      label="Your Selection:" 
                      value={
                        <span className="flex items-center">
                          {selectedParticipant?.name}
                          {selectedParticipant?.isPopular && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Sparkles className="h-3 w-3 ml-1 text-yellow-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Popular pick</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </span>
                      } 
                      bold 
                    />
                    <DisplayRow 
                      label="Odds:" 
                      value={
                        <span className={odds > 2 ? "text-green-400" : "text-orange-400"}>
                          {odds.toFixed(2)}
                        </span>
                      } 
                    />
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Bet Amount:</label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className="w-full text-right"
                          placeholder="Enter amount"
                        />
                        <span className="flex items-center text-sm text-muted-foreground px-2 bg-white/5 rounded border border-white/10">
                          points
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-muted-foreground">0%</span>
                        <span className="text-xs text-muted-foreground">{sliderValue}% of balance</span>
                        <span className="text-xs text-muted-foreground">100%</span>
                      </div>
                      <Slider
                        value={[sliderValue]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleSliderChange}
                        className="my-2"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      {quickBetAmounts.map((amount) => (
                        <Button 
                          key={amount.label}
                          variant="outline" 
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleQuickAmount(amount.value)}
                          disabled={amount.value <= 0}
                        >
                          {amount.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Your Balance:</span>
                      <span className="text-sm font-medium">{currentBalance} points</span>
                    </div>
                    <DisplayRow 
                      label="Potential Win:" 
                      value={`${potentialWin.toFixed(0)} points`} 
                      bold 
                      highlight
                    />
                  </div>

                  {insufficientBalance && (
                    <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">
                        Insufficient balance. You need {currentBet?.amount - currentBalance} more points.
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full relative overflow-hidden"
                    onClick={handlePlaceBet}
                    disabled={!isValidBet || isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <span>Place Bet</span>
                        {isValidBet && (
                          <span className="absolute right-4 bg-blue-500/30 px-2 py-0.5 rounded text-xs">
                            {currentBet?.amount} pts
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center">
              <div className="rounded-full bg-white/5 p-4 mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <p>Your bet slip is empty</p>
              <p className="text-xs mt-2 max-w-xs text-white/40">
                Select an option from the betting markets to add it to your slip
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface DisplayRowProps {
  label: string;
  value?: string | number | React.ReactNode;
  bold?: boolean;
  highlight?: boolean;
}

function DisplayRow({ label, value, bold, highlight }: DisplayRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`
        ${bold ? "text-lg font-bold" : "text-sm font-medium"}
        ${highlight ? "text-blue-400" : ""}
      `}>
        {value}
      </span>
    </div>
  );
}