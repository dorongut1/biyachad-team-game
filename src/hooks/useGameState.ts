import { useState, useEffect, useCallback } from 'react';
import { GameStage, Participant, GameState, Team, ViewMode } from '../types';
import { TEAM_TEMPLATES } from '../constants';

const STORAGE_KEY = 'TOGETHER_GAME_STATE';

const initialState: GameState = {
  currentStage: GameStage.Welcome,
  companyName: 'הצוות שלנו',
  participants: [],
  teams: TEAM_TEMPLATES.map(t => ({ ...t, score: 0 })),
  currentQuestionIndex: 0,
  timer: 0,
  isTimerActive: false,
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: convert old 'stage' to 'currentStage'
        if (parsed.stage !== undefined && parsed.currentStage === undefined) {
          parsed.currentStage = parsed.stage;
          delete parsed.stage;
        }
        // Validate currentStage is a valid number
        if (typeof parsed.currentStage !== 'number' || isNaN(parsed.currentStage)) {
          parsed.currentStage = GameStage.Welcome;
        }
        return { ...initialState, ...parsed };
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  const [currentUser, setCurrentUser] = useState<Participant | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Keep currentUser in sync
  useEffect(() => {
    if (currentUser) {
      const updated = state.participants.find(p => p.id === currentUser.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
        setCurrentUser(updated);
      }
    }
  }, [state.participants, currentUser]);

  const updateState = useCallback((updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Add new participant
  const addParticipant = useCallback((name: string, emoji: string, bio: string) => {
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      emoji,
      bio,
      isHost: state.participants.length === 0,
      answers: {},
      receivedFeedback: [],
      score: 0,
    };
    setState(prev => ({
      ...prev,
      participants: [...prev.participants, newParticipant]
    }));
    setCurrentUser(newParticipant);
    return newParticipant;
  }, [state.participants.length]);

  // Assign teams randomly
  const assignTeams = useCallback(() => {
    const shuffled = [...state.participants].sort(() => Math.random() - 0.5);
    const teamsCount = Math.min(4, Math.ceil(shuffled.length / 3));
    const updatedParticipants = shuffled.map((p, index) => ({
      ...p,
      teamId: TEAM_TEMPLATES[index % teamsCount].id
    }));
    setState(prev => ({
      ...prev,
      participants: updatedParticipants,
      teams: TEAM_TEMPLATES.slice(0, teamsCount).map(t => ({ ...t, score: 0 }))
    }));
  }, [state.participants]);

  // Add score to team
  const addTeamScore = useCallback((teamId: string, points: number) => {
    setState(prev => ({
      ...prev,
      teams: prev.teams.map(t => 
        t.id === teamId ? { ...t, score: t.score + points } : t
      )
    }));
  }, []);

  // Navigation
  const nextStage = useCallback(() => {
    if (state.currentStage < GameStage.Finale) {
      setState(prev => ({
        ...prev,
        currentStage: prev.currentStage + 1,
        currentQuestionIndex: 0,
        timer: 0,
        isTimerActive: false
      }));
    }
  }, [state.currentStage]);

  const previousStage = useCallback(() => {
    if (state.currentStage > GameStage.Welcome) {
      setState(prev => ({
        ...prev,
        currentStage: prev.currentStage - 1
      }));
    }
  }, [state.currentStage]);

  const goToStage = useCallback((stage: GameStage) => {
    setState(prev => ({
      ...prev,
      currentStage: stage,
      currentQuestionIndex: 0,
      timer: 0,
      isTimerActive: false
    }));
  }, []);

  // Submit answer - uses currentUser's ID
  const submitAnswer = useCallback((questionId: string, answer: any) => {
    if (!currentUser) return;
    setState(prev => ({
      ...prev,
      participants: prev.participants.map(p =>
        p.id === currentUser.id
          ? { ...p, answers: { ...p.answers, [questionId]: answer } }
          : p
      )
    }));
  }, [currentUser]);

  // Add feedback (gift message)
  const sendFeedback = useCallback((toId: string, message: string) => {
    const fromName = currentUser?.name || 'אנונימי';
    setState(prev => ({
      ...prev,
      participants: prev.participants.map(p =>
        p.id === toId
          ? {
              ...p,
              receivedFeedback: [...(p.receivedFeedback || []), { fromId: currentUser?.id || '', fromName, message }]
            }
          : p
      )
    }));
  }, [currentUser]);

  // Next question
  const nextQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
  }, []);

  // Set company name
  const setCompanyName = useCallback((name: string) => {
    setState(prev => ({ ...prev, companyName: name }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
    setCurrentUser(null);
  }, []);

  // Add mock participants for demo
  const addMockParticipants = useCallback(() => {
    const mockNames = [
      { name: 'דוד', emoji: '😊', bio: 'אוהב טכנולוגיה' },
      { name: 'שרה', emoji: '😎', bio: 'מנהלת פרויקטים' },
      { name: 'יוסי', emoji: '🚀', bio: 'מפתח Full Stack' },
      { name: 'רחל', emoji: '✨', bio: 'מעצבת UX' },
      { name: 'מיכאל', emoji: '🔥', bio: 'DevOps Engineer' },
      { name: 'נועה', emoji: '🌈', bio: 'Product Manager' },
      { name: 'אסף', emoji: '💪', bio: 'Tech Lead' },
      { name: 'לירון', emoji: '🎯', bio: 'QA Engineer' },
    ];
    
    const mockParticipants: Participant[] = mockNames.map((m, i) => ({
      id: `mock-${i}`,
      name: m.name,
      emoji: m.emoji,
      bio: m.bio,
      isHost: i === 0,
      answers: {},
      receivedFeedback: [],
      score: 0,
    }));

    setState(prev => ({
      ...prev,
      participants: mockParticipants
    }));
  }, []);

  // Determine view mode from URL
  const viewMode: ViewMode = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('host') === 'true'
    ? 'host'
    : 'participant';

  return {
    state,
    currentUser,
    viewMode,
    setCurrentUser,
    updateState,
    addParticipant,
    assignTeams,
    addTeamScore,
    nextStage,
    previousStage,
    goToStage,
    submitAnswer,
    sendFeedback,
    nextQuestion,
    setCompanyName,
    resetGame,
    addMockParticipants,
  };
};
