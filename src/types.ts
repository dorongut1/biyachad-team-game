// Game stages - כל השלבים של המשחק
export enum GameStage {
  Welcome = 0,
  IceBreaker = 1,
  WhoKnowsWho = 2,
  TeamAssignment = 3,
  TeamBattle = 4,
  TwoTruths = 5,
  TeamChallenge = 6,
  Gift = 7,
  Reflection = 8,
  Finale = 9
}

// Team definition
export interface Team {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  score: number;
}

// Feedback entry
export interface FeedbackEntry {
  fromId: string;
  fromName: string;
  message: string;
}

// Participant
export interface Participant {
  id: string;
  name: string;
  emoji: string;
  bio: string;
  isHost: boolean;
  teamId?: string;
  answers: Record<string, any>;
  receivedFeedback: FeedbackEntry[];
  score: number;
}

// Question types
export interface Question {
  id: string;
  text: string;
  type: 'text' | 'choice';
  options?: string[];
}

export interface BattleQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TeamChallenge {
  id: string;
  title: string;
  name: string;
  description: string;
  time: number;
  timeLimit: number;
  points: number;
  emoji: string;
}

// Quote
export interface Quote {
  text: string;
  source: string;
}

// Game State
export interface GameState {
  currentStage: GameStage;
  companyName: string;
  participants: Participant[];
  teams: Team[];
  currentQuestionIndex: number;
  timer: number;
  isTimerActive: boolean;
}

// View mode
export type ViewMode = 'host' | 'participant';
