
import React, { useState, useCallback } from 'react';
import { CORE_IDEA, SHOCKWAVE_LINE } from './constants';
import { AnalysisResult } from './types';
import { getMentalOSUpgrade } from './services/geminiService';
import { ExpandableCard } from './components/ExpandableCard';
import Loader from './components/Loader';
import { Download } from 'lucide-react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

const App: React.FC = () => {
  const [thought, setThought] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessThought = useCallback(async () => {
    if (!thought.trim()) {
      setError('Please enter a thought to process.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await getMentalOSUpgrade(thought);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [thought]);

  const generateReportText = (): string => {
    if (!analysisResult) return '';
    let text = 'Neuro-Architect: Mental OS Upgrade Report\n\n';
    text += `Original Thought: ${thought}\n\n`;
    text += '--- YOUR PROCESSED THOUGHT: THE 6-STEP TRANSFORMATION ---\n\n';
    analysisResult.sixStepTransformation.forEach(step => {
        text += `${step.title}\n${step.content}\n\n`;
    });
    text += '\n--- STRATEGIC INSIGHTS & NEURO-ARCHITECT GUIDANCE ---\n\n';
    text += `${analysisResult.strategicInsights.title}\n${analysisResult.strategicInsights.content}\n`;
    return text;
  };

  const handleDownload = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neuro-architect-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-black text-foreground font-sans p-4 md:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-12 space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Neuro-Architect
          </h1>
          <p className="text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">Mental OS Upgrade</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="flex flex-col space-y-8">
            <Card className="border-border bg-card/50 backdrop-blur-sm shadow-2xl animate-in fade-in slide-in-from-left-8 duration-700">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Core Principle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{CORE_IDEA}</p>
                <p className="font-mono text-sm text-foreground/80 border-l-2 border-primary pl-4">{SHOCKWAVE_LINE}</p>
              </CardContent>
            </Card>

            <Card className="flex-grow flex flex-col border-border bg-card/50 backdrop-blur-sm shadow-2xl animate-in fade-in slide-in-from-left-8 duration-700 delay-150">
              <CardHeader>
                <CardTitle className="text-xl">Deconstruct a Narrative</CardTitle>
                <CardDescription>Enter the thought or internal narrative you want to transform</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col space-y-4">
                <Textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="Enter your thought here..."
                  className="flex-grow min-h-[200px] resize-none bg-background/50 border-border focus:border-primary transition-all duration-300"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleProcessThought}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? 'Processing...' : 'Process & Unlock Reality'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <Card className="border-border bg-card/50 backdrop-blur-sm shadow-2xl min-h-[60vh] flex flex-col animate-in fade-in slide-in-from-right-8 duration-700">
            <CardContent className="flex-grow flex flex-col p-6">
              {isLoading && <Loader />}
              {error && <div className="text-destructive text-center my-auto font-medium">{error}</div>}
              {!isLoading && !error && !analysisResult && (
                <div className="text-center my-auto space-y-4">
                  <h3 className="text-2xl font-semibold text-foreground">Your Transformation Awaits</h3>
                  <p className="text-muted-foreground">Enter a thought on the left to begin your Mental OS Upgrade.</p>
                </div>
              )}
              {analysisResult && (
                <div className="overflow-y-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-bold text-center text-foreground">Your Processed Thought: The 6-Step Transformation</h2>
                  {analysisResult.sixStepTransformation.map((step, index) => (
                    <ExpandableCard key={index} title={step.title} content={step.content} initiallyOpen={index < 2} />
                  ))}

                  <h2 className="text-2xl font-bold mt-8 text-center text-foreground">Strategic Insights & Neuro-Architect Guidance</h2>
                  <Card className="border-border bg-background/50">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{analysisResult.strategicInsights.content}</p>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleDownload}
                      variant="secondary"
                      size="lg"
                      className="shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Download className="w-5 h-5 mr-2"/>
                      Download Full Report (.txt)
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default App;
