export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface ZodiacInfo {
  id: ZodiacSign;
  label: string;
  slang: string;
  description: string;
  icon: string;
  ruler: string;
  element: string;
  metaphor: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
  }[];
}

export interface QuizResult {
  persona: string;
  motto: string;
  roast: string;
  audit: {
    strengths: string;
    weaknesses: string;
  };
  advice: string;
  imageUrl?: string;
}
