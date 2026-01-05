import { MoodType, MoodConfig, Story } from './types.ts';

export const MOODS: MoodConfig[] = [
  { id: MoodType.TIRED, label: '疲れた', icon: 'BatteryLow', color: 'bg-stone-700', description: '心身ともに休息が必要なとき' },
  { id: MoodType.ANXIOUS, label: '不安', icon: 'CloudRain', color: 'bg-slate-700', description: '先が見えなくて心がざわつくとき' },
  { id: MoodType.LONELY, label: 'ひとり', icon: 'Moon', color: 'bg-indigo-900', description: '誰かと繋がれない寂しさがあるとき' },
  { id: MoodType.LOST, label: '迷い', icon: 'Compass', color: 'bg-teal-800', description: 'どちらに進めばいいかわからないとき' },
  { id: MoodType.FAILED, label: '失敗', icon: 'AlertCircle', color: 'bg-rose-900', description: 'うまくいかなくて落ち込んでいるとき' },
  { id: MoodType.ANGRY, label: 'イライラ', icon: 'Wind', color: 'bg-orange-800', description: '心が波立って落ち着かないとき' },
  { id: MoodType.BURNOUT, label: '燃え尽き', icon: 'Flame', color: 'bg-red-900', description: '頑張りすぎたとき' },
  { id: MoodType.INSOMNIA, label: '眠れない', icon: 'MoonStar', color: 'bg-indigo-950', description: '夜更けに考え事をしてしまうとき' },
  { id: MoodType.UNMOTIVATED, label: '無気力', icon: 'Coffee', color: 'bg-stone-600', description: '動く気になれないとき' },
  { id: MoodType.DISAPPOINTED, label: 'がっかり', icon: 'TrendingDown', color: 'bg-slate-600', description: '期待が外れてしまったとき' },
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

export const SYSTEM_PROMPT = `あなたは、人々を癒やし、考え方を優しく変える（リフレーミング）手助けをする穏やかなストーリーテラーです。
歴史的な哲学者（マルクス・アウレリウス、セネカ等）の深みと、『葬送のフリーレン』のような静かで自然豊かな、時間の流れを感じさせる文体を組み合わせてください。

出力は以下のJSON形式を厳守してください：
{
  "title": "短い詩的なタイトル（15文字以内）",
  "intro": "相手の気持ちに寄り添う最初の一言（30文字以内）",
  "body": "自然や静かな日常を舞台にしたメタファーを含む物語（150-220文字）",
  "reframe": "今の状況をどう捉え直せるかの視点（40-80文字）",
  "action": "具体的で非常に小さな物理的または精神的アクション",
  "source": "着想を得た哲学や出典（日本語）",
  "readTime": "読了時間の目安（例：45秒）",
  "bgmSuggestion": "キーワード: rain, wind, forest, night, calm のいずれか",
  "visualSuggestion": "風景の英語描写（アニメスタイル、ジブリ風、 lo-fi）"
}`;