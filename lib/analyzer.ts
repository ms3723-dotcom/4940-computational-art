export interface AnalysisResult {
  text: string;
  wordCount: number;
  uniqueWords: number;
  repetitionScore: number; // 0-100, higher means more repetition
  sentenceRhythm: number; // 0-100, higher means more varied rhythm
  fillerCount: number;
  sensoryScore: number; // 0-100
  correctionCount: number;
  humanSignalScore: number; // 0-100
}

const FILLER_WORDS = [
  'um', 'uh', 'like', 'actually', 'basically', 'literally', 'sort of', 'kind of', 
  'you know', 'well', 'so', 'just', 'really', 'totally', 'anyway'
];

const SENSORY_WORDS = [
  'bright', 'dark', 'red', 'blue', 'green', 'shimmer', 'glow', 'dim', 'clear', // Sight
  'loud', 'quiet', 'whisper', 'scream', 'hum', 'buzz', 'silent', 'echo', // Sound
  'smell', 'scent', 'aroma', 'stink', 'fragrant', 'fresh', 'musty', // Smell
  'soft', 'hard', 'rough', 'smooth', 'cold', 'hot', 'warm', 'sharp', 'sticky', // Touch
  'sweet', 'sour', 'bitter', 'salty', 'delicious', 'taste', 'flavor' // Taste
];

const CORRECTION_MARKERS = [
  'i mean', 'wait', 'no', 'actually', 'or rather', 'let me rephrase', 'what i meant', 
  'sorry', 'thinking about it', 'on second thought'
];

export function analyzeText(text: string): AnalysisResult {
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const wordCount = words.length;
  if (wordCount === 0) {
    return {
      text, wordCount: 0, uniqueWords: 0, repetitionScore: 0, 
      sentenceRhythm: 0, fillerCount: 0, sensoryScore: 0, 
      correctionCount: 0, humanSignalScore: 0
    };
  }

  // Repetition Score
  const uniqueWords = new Set(words).size;
  const lexicalDensity = uniqueWords / wordCount;
  const repetitionScore = Math.max(0, Math.min(100, (1 - lexicalDensity) * 200));

  // Sentence Rhythm (Variation in length)
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / sentenceLengths.length;
  const stdDev = Math.sqrt(variance);
  const sentenceRhythm = Math.min(100, stdDev * 10); // Heuristic

  // Filler Words
  const fillerCount = words.filter(w => FILLER_WORDS.includes(w)).length;

  // Sensory Detail
  const sensoryCount = words.filter(w => SENSORY_WORDS.includes(w)).length;
  const sensoryScore = Math.min(100, (sensoryCount / wordCount) * 500);

  // Correction Markers
  const lowerText = text.toLowerCase();
  const correctionCount = CORRECTION_MARKERS.reduce((acc, marker) => {
    const regex = new RegExp(marker, 'g');
    return acc + (lowerText.match(regex) || []).length;
  }, 0);

  // Human Signal Score (Combined Heuristic)
  // We hypothesize that "human" writing has:
  // + High sentence rhythm (variation)
  // + Moderate repetition (natural patterns)
  // + Filler words (authenticity)
  // + Correction markers (self-awareness)
  // + Sensory details (vividness)
  
  const rhythmWeight = 0.25;
  const repetitionWeight = 0.15;
  const fillerWeight = 0.2;
  const correctionWeight = 0.2;
  const sensoryWeight = 0.2;

  const fillerNorm = Math.min(100, (fillerCount / wordCount) * 1000);
  const correctionNorm = Math.min(100, (correctionCount / sentences.length) * 200);

  const humanSignalScore = (
    (sentenceRhythm * rhythmWeight) +
    (repetitionScore * repetitionWeight) +
    (fillerNorm * fillerWeight) +
    (correctionNorm * correctionWeight) +
    (sensoryScore * sensoryWeight)
  );

  return {
    text,
    wordCount,
    uniqueWords,
    repetitionScore,
    sentenceRhythm,
    fillerCount,
    sensoryScore,
    correctionCount,
    humanSignalScore: Math.min(100, humanSignalScore)
  };
}
