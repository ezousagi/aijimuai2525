import React, { useState } from 'react';
import { MoodGrid } from './components/MoodGrid';
import { StoryView } from './components/StoryView';
import { SafetyBar } from './components/SafetyBar';
import { Story, MoodType } from './types';
import { generateStoryForMood } from './services/geminiService';
import { Sparkles, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'HOME' | 'PLAYER'>('HOME');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMood, setLastMood] = useState<MoodType | null>(null);

  const handleMoodSelect = async (mood: MoodType) => {
    setIsLoading(true);
    setLastMood(mood);
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const story = await generateStoryForMood(mood);
      setCurrentStory(story);
      setCurrentScreen('PLAYER');
    } catch (e) {
      console.error(e);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentScreen('HOME');
    // Keep the story in memory but allow picking a new mood
  };

  const handleRegenerate = () => {
    if (lastMood) {
      handleMoodSelect(lastMood);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] text-stone-200 selection:bg-emerald-500/30">
      
      <SafetyBar />

      {currentScreen === 'HOME' && (
        <div className="min-h-screen flex flex-col items-center justify-center py-20 relative overflow-hidden">
          
          {/* Ambient Background Elements */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-emerald-900/5 blur-3xl pointer-events-none" />

          {/* Hero Section */}
          <div className="text-center mb-12 px-4 z-10">
            <div className="flex items-center justify-center gap-2 mb-4 text-emerald-400/80">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm tracking-widest uppercase font-semibold">Rest Stop</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
              今の気分は、<br className="md:hidden"/>どうですか？
            </h1>
            <p className="text-stone-400 max-w-md mx-auto leading-relaxed">
              短い物語と静かな時間で、<br/>
              心に小さな余白を作りましょう。
            </p>
          </div>

          {/* Interaction Area */}
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6 fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-serif text-white">物語を紡いでいます...</p>
                <p className="text-sm text-stone-500">深呼吸をひとつして、お待ちください</p>
              </div>
            </div>
          ) : (
            <div className="fade-in w-full flex justify-center">
              <MoodGrid onSelect={handleMoodSelect} disabled={isLoading} />
            </div>
          )}

          {/* Footer */}
          {!isLoading && (
            <footer className="absolute bottom-6 text-xs text-stone-600 font-mono">
              Powered by Gemini • Minimal Self-Care
            </footer>
          )}
        </div>
      )}

      {currentScreen === 'PLAYER' && currentStory && (
        <StoryView 
          story={currentStory} 
          onBack={handleBack} 
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};

export default App;