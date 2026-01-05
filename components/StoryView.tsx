import React, { useState, useEffect } from 'react';
import { Story } from '../types.ts';
import { Volume2, VolumeX, ArrowLeft, RefreshCw, Heart, Share2, BookOpen, Timer, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio.ts';

interface StoryViewProps {
  story: Story;
  onBack: () => void;
  onRegenerate: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({ story, onBack, onRegenerate }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [liked, setLiked] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);

    const startAudio = async () => {
      try {
        await soundEngine.play(story.bgmSuggestion);
        setIsPlaying(true);
      } catch (e) {
        console.warn("Autoplay blocked, user interaction required", e);
        setIsPlaying(false);
      }
    };
    startAudio();

    return () => {
      clearTimeout(timer);
      soundEngine.stop();
    };
  }, [story.id, story.bgmSuggestion]);

  const toggleSound = () => {
    const newState = soundEngine.toggle(story.bgmSuggestion);
    setIsPlaying(newState);
  };

  const toggleTimer = () => {
    if (timerActive) {
      soundEngine.clearTimer();
      setTimerActive(false);
    } else {
      if (!isPlaying) {
        soundEngine.play(story.bgmSuggestion);
        setIsPlaying(true);
      }
      soundEngine.setTimer(300, () => {
        setTimerActive(false);
        setIsPlaying(false);
      });
      setTimerActive(true);
    }
  };

  const handleShare = async () => {
    const text = `『${story.title}』\n${story.intro}\n\n#RestStop #一息の場所`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rest Stop - 一息の場所',
          text: text,
          url: url,
        });
      } catch (error) {}
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        console.error('Copy failed', err);
      }
    }
  };

  const bgUrl = story.imageUrl 
    ? story.imageUrl 
    : `https://picsum.photos/seed/${story.visualSuggestion + story.id}/1080/1920?grayscale&blur=2`;

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="w-full h-full bg-cover bg-center animate-ken-burns opacity-60"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/90" />
      </div>

      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
        <button 
          onClick={onBack}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTimer}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-full transition-all backdrop-blur-md border
              ${timerActive 
                ? 'text-amber-300 bg-amber-900/40 border-amber-500/30' 
                : 'text-white/50 bg-black/20 border-transparent hover:bg-white/10'}
            `}
            title={timerActive ? "タイマー解除" : "5分タイマー"}
          >
            <Timer className={`w-4 h-4 ${timerActive ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium tracking-wider">
              {timerActive ? '5min ON' : '5min'}
            </span>
          </button>

          <button 
            onClick={toggleSound}
            className={`p-2 rounded-full transition-all backdrop-blur-md ${isPlaying ? 'text-emerald-300 bg-emerald-900/40' : 'text-white/50 bg-black/20'}`}
            title={isPlaying ? "ミュート" : "サウンド再生"}
          >
            {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div 
        className={`
          relative z-10 max-w-lg w-full max-h-[85vh] overflow-y-auto 
          px-8 py-12 md:px-12 md:py-16
          transition-all duration-1000 ease-out scrollbar-hide
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <p className="text-xs tracking-[0.2em] text-stone-400 uppercase">
              {story.readTime}の休息
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-white leading-relaxed drop-shadow-lg">
              {story.title}
            </h1>
            <div className="w-12 h-[1px] bg-stone-500/50 mx-auto" />
            <p className="text-stone-300 font-light italic text-sm">
              「{story.intro}」
            </p>
          </div>

          <div className="font-serif text-lg leading-loose text-stone-100/95 whitespace-pre-wrap drop-shadow-md">
            {story.body}
          </div>

          {story.source && (
            <div className="flex items-center justify-end gap-2 text-xs text-stone-500 font-serif border-t border-white/5 pt-4">
              <BookOpen className="w-3 h-3" />
              <span>{story.source}</span>
            </div>
          )}

          <div className="bg-white/10 border border-white/10 rounded-lg p-6 backdrop-blur-md mt-4 shadow-xl">
            <h3 className="text-stone-300 text-xs font-bold tracking-widest uppercase mb-2 opacity-80">
              新しい視点
            </h3>
            <p className="text-emerald-50 font-medium leading-relaxed">
              {story.reframe}
            </p>
          </div>

          <div className="border-l-2 border-emerald-500 pl-4 py-1">
            <h3 className="text-stone-400 text-xs font-bold tracking-widest uppercase mb-1">
              小さく動く
            </h3>
            <p className="text-white/90">
              {story.action}
            </p>
          </div>

          <div className="flex justify-center gap-6 pt-8">
            <button 
              onClick={() => setLiked(!liked)}
              className={`p-3 rounded-full transition-all ${liked ? 'bg-rose-900/50 text-rose-300' : 'bg-white/5 text-stone-400 hover:bg-white/10'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={onRegenerate}
              className="p-3 bg-white/5 text-stone-400 rounded-full hover:bg-white/10 transition-all hover:text-emerald-300 hover:rotate-180 duration-500"
              title="別の物語へ"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button 
              onClick={handleShare}
              className="p-3 bg-white/5 text-stone-400 rounded-full hover:bg-white/10 transition-all"
              title="シェア"
            >
              {shared ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};