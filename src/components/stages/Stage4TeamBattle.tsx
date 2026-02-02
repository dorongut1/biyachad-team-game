import React, { useState, useEffect } from 'react';
import { GameState, Participant, ViewMode } from '../../types';
import { QUOTES, BATTLE_QUESTIONS } from '../../constants';
import QuoteCard from '../shared/QuoteCard';
import TeamScoreBoard from '../shared/TeamScoreBoard';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onNext: () => void;
  onAddTeamScore: (teamId: string, points: number) => void;
}

export const Stage4TeamBattle: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onNext,
  onAddTeamScore
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const question = BATTLE_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= BATTLE_QUESTIONS.length - 1;

  // Timer
  useEffect(() => {
    if (showAnswer || viewMode !== 'host') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowAnswer(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, showAnswer, viewMode]);

  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered || showAnswer) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);

    // Award points if correct
    if (answerIndex === question.correctIndex && currentUser?.teamId) {
      onAddTeamScore(currentUser.teamId, 10);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      onNext();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(15);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  };

  // HOST VIEW
  if (viewMode === 'host') {
    return (
      <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">⚔️ קרב צוותים!</h1>
          <QuoteCard quote={QUOTES[4]} size="small" className="max-w-xl" />
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {BATTLE_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-2 rounded-full transition-all ${
                i < currentQuestionIndex ? 'bg-emerald-500' :
                i === currentQuestionIndex ? 'bg-secondary' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Score Board */}
        <div className="w-full max-w-2xl mb-6">
          <TeamScoreBoard teams={state.teams} showRank={false} />
        </div>

        {/* Timer */}
        {!showAnswer && (
          <div className={`text-8xl font-mono font-black mb-6 ${
            timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'
          }`}>
            {timeLeft}
          </div>
        )}

        {/* Question */}
        <div className="glass-card p-8 rounded-3xl max-w-3xl w-full mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{question.question}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((opt, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl text-xl font-bold transition-all ${
                  showAnswer
                    ? i === question.correctIndex
                      ? 'bg-emerald-500 text-white scale-105'
                      : 'bg-white/10 opacity-50'
                    : 'glass hover:bg-white/20'
                }`}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>

        {/* Show answer / Next */}
        <div className="flex gap-4">
          {!showAnswer && (
            <button 
              onClick={() => setShowAnswer(true)} 
              className="btn-ghost"
            >
              הצג תשובה
            </button>
          )}
          {showAnswer && (
            <div className="animate-fadeIn text-center">
              <p className="text-emerald-400 font-bold text-xl mb-4">
                ✅ {question.options[question.correctIndex]}
              </p>
              <button onClick={handleNextQuestion} className="btn-primary">
                {isLastQuestion ? 'לשלב הבא ←' : 'שאלה הבאה ←'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PARTICIPANT VIEW
  const myTeam = state.teams.find(t => t.id === currentUser?.teamId);

  return (
    <div className="flex flex-col min-h-screen p-6 animate-fadeIn">
      {/* Team badge */}
      {myTeam && (
        <div className={`${myTeam.bgColor} px-4 py-2 rounded-full self-center mb-4`}>
          <span className="font-bold">{myTeam.name}</span>
        </div>
      )}

      {/* Timer */}
      {!showAnswer && !hasAnswered && (
        <div className={`text-5xl font-mono font-black text-center mb-4 ${
          timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'
        }`}>
          {timeLeft}
        </div>
      )}

      {/* Question */}
      <div className="glass-card p-6 rounded-2xl mb-6">
        <h2 className="text-xl font-bold text-white text-center">{question.question}</h2>
      </div>

      {hasAnswered ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">
            {selectedAnswer === question.correctIndex ? '🎉' : '😅'}
          </div>
          <p className={`font-bold text-xl ${
            selectedAnswer === question.correctIndex ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {selectedAnswer === question.correctIndex 
              ? 'נכון! +10 נקודות לצוות!' 
              : 'לא נורא, בשאלה הבאה!'}
          </p>
          <p className="text-white/60 mt-4">ממתינים לשאלה הבאה...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 flex-1">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showAnswer}
              className={`p-5 rounded-2xl text-lg font-bold transition-all active:scale-95 ${
                showAnswer
                  ? i === question.correctIndex
                    ? 'bg-emerald-500'
                    : 'bg-white/10 opacity-50'
                  : 'glass hover:bg-secondary/50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stage4TeamBattle;
