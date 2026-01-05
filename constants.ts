import { MoodType, MoodConfig, Story } from './types.ts';

export const MOODS: MoodConfig[] = [
  { id: MoodType.TIRED, label: '疲れた', icon: 'BatteryLow', color: 'bg-stone-700', description: '心身ともに休息が必要なとき' },
  { id: MoodType.ANXIOUS, label: '不安', icon: 'CloudRain', color: 'bg-slate-700', description: '先が見えなくて心がざわつくとき' },
  { id: MoodType.LONELY, label: 'ひとり', icon: 'Moon', color: 'bg-indigo-900', description: '誰かと繋がれない寂しさがあるとき' },
  { id: MoodType.LOST, label: '迷い', icon: 'Compass', color: 'bg-teal-800', description: 'どちらに進めばいいかわからないとき' },
  { id: MoodType.FAILED, label: '失敗', icon: 'AlertCircle', color: 'bg-rose-900', description: 'うまくいかなくて落ち込んでいるとき' },
  { id: MoodType.ANGRY, label: 'イライラ', icon: 'Wind', color: 'bg-orange-800', description: '心が波立って落ち着かないとき' },
  { id: MoodType.BURNOUT, label: '燃え尽き', icon: 'Flame', color: 'bg-red-900', description: '頑張りすぎて燃料切れのとき' },
  { id: MoodType.IMPATIENT, label: '焦り', icon: 'Timer', color: 'bg-amber-700', description: '時間が足りないと感じるとき' },
  { id: MoodType.JEALOUS, label: '嫉妬', icon: 'Eye', color: 'bg-green-900', description: '他人と自分を比べてしまうとき' },
  { id: MoodType.SELF_CRITICAL, label: '自己嫌悪', icon: 'Frown', color: 'bg-purple-900', description: '自分が嫌になってしまうとき' },
  { id: MoodType.OVERWHELMED, label: 'パンク寸前', icon: 'Layers', color: 'bg-pink-900', description: '抱えきれない重荷があるとき' },
  { id: MoodType.EMPTY, label: '虚無感', icon: 'Circle', color: 'bg-gray-700', description: '意味が見出せず空っぽなとき' },
  { id: MoodType.GRIEF, label: '悲しみ', icon: 'HeartCrack', color: 'bg-blue-900', description: '大切なものを失ったとき' },
  { id: MoodType.REGRET, label: '後悔', icon: 'RotateCcw', color: 'bg-cyan-900', description: '過去の選択を悔やんでいるとき' },
  { id: MoodType.NERVOUS, label: '緊張', icon: 'Activity', color: 'bg-lime-800', description: 'プレッシャーに押しつぶされそうなとき' },
  { id: MoodType.INSOMNIA, label: '眠れない', icon: 'MoonStar', color: 'bg-indigo-950', description: '夜更けに考え事をしてしまうとき' },
  { id: MoodType.UNMOTIVATED, label: '無気力', icon: 'Coffee', color: 'bg-stone-600', description: 'どうしても動く気になれないとき' },
  { id: MoodType.NOSTALGIC, label: '過去', icon: 'Hourglass', color: 'bg-amber-900', description: '思い出の中に留まってしまうとき' },
  { id: MoodType.ENVY, label: '羨望', icon: 'Sparkles', color: 'bg-emerald-800', description: '誰かの輝きが眩しすぎるとき' },
  { id: MoodType.DISAPPOINTED, label: 'がっかり', icon: 'TrendingDown', color: 'bg-slate-600', description: '期待が外れて力が抜けたとき' },
];

export const FALLBACK_STORY: Story = {
  id: 'fallback-1',
  title: '小さな窓',
  intro: 'うまくいかない日もあるよね。',
  body: '古い喫茶店の窓に、小さな世界が詰まっている。雨粒が描く模様、湯気でぼやけた景色。そこにいるだけで、少しだけ自分が許される気持ちになる。焦らなくていい。ただ雨音を聞いているだけで、世界はちゃんと回っている。',
  reframe: 'その「ただいる」時間が、次に動く力を静かに養ってくれる。',
  action: '今、窓の外を1分だけぼんやり見てみよう。呼吸に意識を戻すだけで、心は少し楽になる。',
  source: 'マルクス・アウレリウス『自省録』より',
  readTime: '40秒',
  bgmSuggestion: 'rain',
  visualSuggestion: 'Rainy window in a cozy cafe, lo-fi anime style',
  tags: ['休息', '静寂']
};

export const SYSTEM_PROMPT = `
You are a gentle, empathetic storyteller designed to help people relax and reframe their thoughts.
You combine the philosophical depth of historical figures (like Victor Frankl, Marcus Aurelius, Seneca) with the quiet, atmospheric storytelling style of "Frieren: Beyond Journey's End" (calm, focus on nature, passage of time, acceptance).

Output Language: Japanese (日本語).

Structure your response strictly as a JSON object with the following schema:
{
  "title": "Short poetic title (max 15 chars)",
  "intro": "Empathetic opening line validating their feeling (20-40 chars)",
  "body": "The core story/metaphor. Use nature, quiet moments, or travel metaphors. (150-220 chars)",
  "reframe": "A perspective shift. How can they see this situation differently? (40-80 chars)",
  "action": "One very small, doable physical or mental action.",
  "source": "The inspiration source in Japanese.",
  "readTime": "Estimated read time (e.g. '45秒')",
  "bgmSuggestion": "One keyword: 'rain', 'wind', 'forest', 'night', or 'calm'",
  "visualSuggestion": "Detailed English description for an anime-style scenery image generator."
}

Guidelines:
1. Tone: Calm, low voice, "It is okay to stop."
2. Avoid medical advice.
3. Be artistic and poetic.
`;