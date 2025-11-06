
import React, { useState, useCallback } from 'react';
import { CORE_IDEA, SHOCKWAVE_LINE } from './constants';
import { AnalysisResult } from './types';
import { getMentalOSUpgrade } from './services/geminiService';
import { ExpandableCard } from './components/ExpandableCard';
import Loader from './components/Loader';
import { DownloadIcon } from './components/icons/DownloadIcon';

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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white font-sans p-4 md:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Neuro-Architect
          </h1>
          <p className="text-lg text-gray-300 mt-2">Mental OS Upgrade</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="flex flex-col space-y-8">
            <div className="border border-white/10 bg-black/20 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-pink-400 mb-2">Core Principle</h2>
              <p className="text-gray-300 mb-4">{CORE_IDEA}</p>
              <p className="font-mono text-fuchsia-400">{SHOCKWAVE_LINE}</p>
            </div>

            <div className="flex-grow flex flex-col border border-white/10 bg-black/20 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Deconstruct a Narrative</h2>
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="Enter the thought or internal narrative you want to transform..."
                className="w-full flex-grow bg-gray-900/50 border border-white/20 rounded-md p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 min-h-[150px]"
                disabled={isLoading}
              />
              <button
                onClick={handleProcessThought}
                disabled={isLoading}
                className="mt-4 w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? 'Processing...' : 'Process & Unlock Reality'}
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="border border-white/10 bg-black/20 backdrop-blur-md rounded-lg p-6 shadow-lg min-h-[60vh] flex flex-col">
            {isLoading && <Loader />}
            {error && <div className="text-red-400 text-center my-auto">{error}</div>}
            {!isLoading && !error && !analysisResult && (
              <div className="text-center my-auto text-gray-400">
                <h3 className="text-2xl font-semibold mb-2">Your Transformation Awaits</h3>
                <p>Enter a thought on the left to begin your Mental OS Upgrade.</p>
              </div>
            )}
            {analysisResult && (
              <div className="overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Your Processed Thought: The 6-Step Transformation</h2>
                {analysisResult.sixStepTransformation.map((step, index) => (
                  <ExpandableCard key={index} title={step.title} content={step.content} initiallyOpen={index < 2} />
                ))}

                <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Strategic Insights & Neuro-Architect Guidance</h2>
                <div className="border border-white/10 bg-black/20 backdrop-blur-md rounded-lg p-4 shadow-lg">
                  <p className="text-gray-300 whitespace-pre-wrap">{analysisResult.strategicInsights.content}</p>
                </div>
                
                <div className="mt-8 text-center">
                    <button
                        onClick={handleDownload}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 inline-flex items-center space-x-2"
                    >
                        <DownloadIcon className="w-5 h-5"/>
                        <span>Download Full Report (.txt)</span>
                    </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
