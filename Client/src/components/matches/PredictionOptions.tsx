
import React, { useState } from 'react';
import { Match } from '../../types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface PredictionOptionsProps {
  match: Match;
}

const PredictionOptions: React.FC<PredictionOptionsProps> = ({ match }) => {
  const [activeTab, setActiveTab] = useState('1x2');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctScore, setCorrectScore] = useState('');
  const isMobile = useIsMobile();

  const handlePredictionSubmit = () => {
    if (!selectedOption && activeTab !== 'correct-score') {
      toast.error("Please select a prediction option first");
      return;
    }
    
    if (activeTab === 'correct-score' && !correctScore) {
      toast.error("Please enter a correct score prediction");
      return;
    }
    
    // Here you would handle the actual prediction submission
    if (activeTab === 'correct-score') {
      toast.success(`Prediction submitted! You selected Correct Score: ${correctScore}`);
      setCorrectScore('');
    } else {
      toast.success(`Prediction submitted! You selected ${selectedOption}`);
      setSelectedOption(null);
    }
  };

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Improved TabsList layout for better responsiveness */}
        <TabsList className="w-full mb-6 overflow-x-auto flex flex-nowrap">
          <TabsTrigger value="1x2" className="flex-1 min-w-[60px] py-3 px-2">1X2</TabsTrigger>
          <TabsTrigger value="btts" className="flex-1 min-w-[60px] py-3 px-2">BTTS</TabsTrigger>
          <TabsTrigger value="ou" className="flex-1 min-w-[60px] py-3 px-2">O/U</TabsTrigger>
          <TabsTrigger value="dc" className="flex-1 min-w-[60px] py-3 px-2">DC</TabsTrigger>
          <TabsTrigger value="correct-score" className="flex-1 min-w-[60px] py-3 px-2">CS</TabsTrigger>
          <TabsTrigger value="first-half" className="flex-1 min-w-[60px] py-3 px-2">1H</TabsTrigger>
        </TabsList>
        
        <TabsContent value="1x2" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={selectedOption === 'home' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('home')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Home Win</span>
              <span className="font-bold text-base">{match.odds.homeWin.toFixed(2)}</span>
              <span className="text-xs truncate max-w-full">{match.homeTeam.name}</span>
            </Button>
            <Button
              variant={selectedOption === 'draw' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('draw')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Draw</span>
              <span className="font-bold text-base">{match.odds.draw.toFixed(2)}</span>
              <span className="text-xs">X</span>
            </Button>
            <Button
              variant={selectedOption === 'away' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('away')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Away Win</span>
              <span className="font-bold text-base">{match.odds.awayWin.toFixed(2)}</span>
              <span className="text-xs truncate max-w-full">{match.awayTeam.name}</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="btts" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selectedOption === 'bttsYes' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('bttsYes')}
              className="flex flex-col items-center p-4 h-auto w-full"
            >
              <span className="text-sm">Yes</span>
              <span className="font-bold text-base">{match.odds.bttsYes.toFixed(2)}</span>
            </Button>
            <Button
              variant={selectedOption === 'bttsNo' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('bttsNo')}
              className="flex flex-col items-center p-4 h-auto w-full"
            >
              <span className="text-sm">No</span>
              <span className="font-bold text-base">{match.odds.bttsNo.toFixed(2)}</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="ou" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              variant={selectedOption === 'over15' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('over15')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Over 1.5</span>
              <span className="font-bold text-base">1.30</span>
            </Button>
            <Button
              variant={selectedOption === 'under15' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('under15')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Under 1.5</span>
              <span className="font-bold text-base">3.50</span>
            </Button>
            <Button
              variant={selectedOption === 'over25' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('over25')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Over 2.5</span>
              <span className="font-bold text-base">{match.odds.over25.toFixed(2)}</span>
            </Button>
            <Button
              variant={selectedOption === 'under25' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('under25')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Under 2.5</span>
              <span className="font-bold text-base">{match.odds.under25.toFixed(2)}</span>
            </Button>
            <Button
              variant={selectedOption === 'over35' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('over35')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Over 3.5</span>
              <span className="font-bold text-base">2.80</span>
            </Button>
            <Button
              variant={selectedOption === 'under35' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('under35')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Under 3.5</span>
              <span className="font-bold text-base">1.45</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="dc" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={selectedOption === 'doubleChanceHomeOrDraw' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('doubleChanceHomeOrDraw')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">1X</span>
              <span className="font-bold text-base">{(1 / ((1 / match.odds.homeWin) + (1 / match.odds.draw))).toFixed(2)}</span>
              <span className="text-xs truncate max-w-full">{match.homeTeam.name} or Draw</span>
            </Button>
            <Button
              variant={selectedOption === 'doubleChanceAwayOrDraw' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('doubleChanceAwayOrDraw')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">X2</span>
              <span className="font-bold text-base">{(1 / ((1 / match.odds.awayWin) + (1 / match.odds.draw))).toFixed(2)}</span>
              <span className="text-xs truncate max-w-full">{match.awayTeam.name} or Draw</span>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="correct-score" className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-3">Enter the final score (e.g., 2-1)</p>
              <Input 
                value={correctScore}
                onChange={(e) => setCorrectScore(e.target.value)}
                placeholder="1-0"
                className="max-w-[120px] mx-auto text-center"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => setCorrectScore("1-0")}
                className="text-sm h-auto p-3 w-full"
              >
                1-0 <span className="ml-1 opacity-70">7.50</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setCorrectScore("2-0")}
                className="text-sm h-auto p-3 w-full"
              >
                2-0 <span className="ml-1 opacity-70">9.00</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setCorrectScore("2-1")}
                className="text-sm h-auto p-3 w-full"
              >
                2-1 <span className="ml-1 opacity-70">8.50</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setCorrectScore("0-0")}
                className="text-sm h-auto p-3 w-full"
              >
                0-0 <span className="ml-1 opacity-70">10.0</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setCorrectScore("1-1")}
                className="text-sm h-auto p-3 w-full"
              >
                1-1 <span className="ml-1 opacity-70">6.50</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setCorrectScore("2-2")}
                className="text-sm h-auto p-3 w-full"
              >
                2-2 <span className="ml-1 opacity-70">12.0</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="first-half" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={selectedOption === 'firstHalfHome' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('firstHalfHome')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Home</span>
              <span className="font-bold text-base">2.40</span>
              <span className="text-xs truncate max-w-full">{match.homeTeam.name}</span>
            </Button>
            <Button
              variant={selectedOption === 'firstHalfDraw' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('firstHalfDraw')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Draw</span>
              <span className="font-bold text-base">2.10</span>
              <span className="text-xs">X</span>
            </Button>
            <Button
              variant={selectedOption === 'firstHalfAway' ? 'default' : 'outline'}
              onClick={() => setSelectedOption('firstHalfAway')}
              className="flex flex-col items-center p-3 h-auto w-full"
            >
              <span className="text-sm">Away</span>
              <span className="font-bold text-base">3.80</span>
              <span className="text-xs truncate max-w-full">{match.awayTeam.name}</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button onClick={handlePredictionSubmit} className="w-full">
          Submit Prediction
        </Button>
      </div>
    </div>
  );
};

export default PredictionOptions;
