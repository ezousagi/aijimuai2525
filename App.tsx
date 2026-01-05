import React, { useState } from 'react';
import { MoodGrid } from './components/MoodGrid.tsx';
import { StoryView } from './components/StoryView.tsx';
import { SafetyBar } from './components/SafetyBar.tsx';
import { Story, MoodType } from './types.ts';
import { generateStoryForMood } from './services/geminiService.ts';
import { Sparkles, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'HOME' | 'PLAYER'>('HOME');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMood, setLastMood] = useState<MoodType | null>(null);

  const handleMoodSelect = async (mood: MoodType) => {
    setIsLoading(true);
    setLastMood(mood);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const story = await generateStoryForMood(mood);
      setCurrentStory(story);
      setCurrentScreen('PLAYER');
    } catch (e) {
      console.error(e);
      alert("物語の生成中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => setCurrentScreen('HOME');
  const handleRegenerate = () => lastMood && handleMoodSelect(lastMood);

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] text-stone-200">
      <SafetyBar />
      {currentScreen === 'HOME' && (
        <div className="min-h-screen flex flex-col items-center justify-center py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
          <div className="text-center mb-12 px-4 z-10">
            <div className="flex items-center justify-center gap-2 mb-4 text-emerald-400/80">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm tracking-widest uppercase font-semibold">Rest Stop</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white leading-tight">
              今の気分は、<br className="md:hidden"/>どうですか？
            </h1>
            <p className="text-stone-400 max-w-md mx-auto leading-relaxed">
              短い物語と静かな時間で、心に小さな余白を作りましょう。
            </p>
          </div>

          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6 fade-in">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
              <div className="text-center">
                <p className="text-lg font-serif text-white">物語を紡いでいます...</p>
                <p className="text-sm text-stone-500">深呼吸をして、お待ちください</p>
              </div>
            </div>
          ) : (
            <div className="fade-in w-full flex justify-center">
              <MoodGrid onSelect={handleMoodSelect} disabled={isLoading} />
            </div>
          )}
        </div>
      )}
      {currentScreen === 'PLAYER' && currentStory && (
        <StoryView story={currentStory} onBack={handleBack} onRegenerate={handleRegenerate} />
      )}
    </div>
  );
};

export default App;