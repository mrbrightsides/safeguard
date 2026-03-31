export interface Question {
  id: number;
  text: string;
  category: 'depression' | 'anxiety' | 'stress';
}

export const DASS21_QUESTIONS: Question[] = [
  { id: 1, text: "I found it hard to wind down", category: 'stress' },
  { id: 2, text: "I was aware of dryness of my mouth", category: 'anxiety' },
  { id: 3, text: "I couldn't seem to experience any positive feeling at all", category: 'depression' },
  { id: 4, text: "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)", category: 'anxiety' },
  { id: 5, text: "I found it difficult to work up the initiative to do things", category: 'depression' },
  { id: 6, text: "I tended to over-react to situations", category: 'stress' },
  { id: 7, text: "I experienced trembling (e.g. in the hands)", category: 'anxiety' },
  { id: 8, text: "I felt that I was using a lot of nervous energy", category: 'stress' },
  { id: 9, text: "I was worried about situations in which I might panic and make a fool of myself", category: 'anxiety' },
  { id: 10, text: "I felt that I had nothing to look forward to", category: 'depression' },
  { id: 11, text: "I found myself getting agitated", category: 'stress' },
  { id: 12, text: "I found it difficult to relax", category: 'stress' },
  { id: 13, text: "I felt down-hearted and blue", category: 'depression' },
  { id: 14, text: "I was intolerant of anything that kept me from getting on with what I was doing", category: 'stress' },
  { id: 15, text: "I felt I was close to panic", category: 'anxiety' },
  { id: 16, text: "I was unable to become enthusiastic about anything", category: 'depression' },
  { id: 17, text: "I felt I wasn't worth much as a person", category: 'depression' },
  { id: 18, text: "I felt that I was rather touchy", category: 'stress' },
  { id: 19, text: "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart skipping a beat)", category: 'anxiety' },
  { id: 20, text: "I felt scared without any good reason", category: 'anxiety' },
  { id: 21, text: "I felt that life was meaningless", category: 'depression' },
];

export const ICD_MAPPING = {
  depression: {
    mild: "F32.0",
    moderate: "F32.1",
    severe: "F32.2",
    extremely_severe: "F32.3"
  },
  anxiety: {
    mild: "F41.1",
    moderate: "F41.1",
    severe: "F41.0",
    extremely_severe: "F41.0"
  },
  stress: {
    mild: "F43.2",
    moderate: "F43.2",
    severe: "F43.2",
    extremely_severe: "F43.2"
  }
};

export const ICD_DESCRIPTIONS: Record<string, string> = {
  "F32.0": "Mild depressive episode",
  "F32.1": "Moderate depressive episode",
  "F32.2": "Severe depressive episode without psychotic symptoms",
  "F32.3": "Severe depressive episode with psychotic symptoms",
  "F41.1": "Generalized anxiety disorder",
  "F41.0": "Panic disorder [episodic paroxysmal anxiety]",
  "F43.2": "Adjustment disorders",
  "F43.1": "Post-traumatic stress disorder",
  "F43.0": "Acute stress reaction",
};
