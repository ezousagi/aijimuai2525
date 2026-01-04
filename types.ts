export interface Story {
  id: string;
  title: string;
  intro: string;
  body: string;
  reframe: string;
  action: string;
  source: string; // New: Source citation
  readTime: string;
  bgmSuggestion: string;
  visualSuggestion: string;
  imageUrl?: string; // New: Generated image base64
  tags: string[];
}

export enum MoodType {
  TIRED = '疲労',
  ANXIOUS = '不安',
  LONELY = '孤独',
  LOST = '迷い',
  FAILED = '失敗',
  ANGRY = '怒り',
  BURNOUT = '燃え尽き',
  IMPATIENT = '焦り',
  JEALOUS = '嫉妬',
  SELF_CRITICAL = '自己嫌悪',
  OVERWHELMED = 'パンク寸前',
  EMPTY = '虚無感',
  GRIEF = '悲しみ',
  REGRET = '後悔',
  NERVOUS = '緊張',
  INSOMNIA = '眠れない',
  UNMOTIVATED = '無気力',
  NOSTALGIC = '過去',
  ENVY = '羨望',
  DISAPPOINTED = 'がっかり'
}

export interface MoodConfig {
  id: MoodType;
  label: string;
  icon: string; // Lucide icon name
  color: string;
  description: string;
}

export interface GeneratorState {
  isLoading: boolean;
  error: string | null;
  currentStory: Story | null;
}