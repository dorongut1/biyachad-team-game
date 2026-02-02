import React, { useState } from 'react';
import { GameState, Participant, ViewMode } from '../../types';
import { QUOTES, WHO_KNOWS_QUESTIONS } from '../../constants';
import QuoteCard from '../shared/QuoteCard';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onNext: () => void;
  onVote?: (participantId: string) => void;
}

export const Stage2WhoKnows: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onNext,
  onVote
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [voted, setVoted] = useState<Record<number, boolean>>({});

  const question = WHO_KNOWS_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= WHO_KNOWS_QUESTIONS.length - 1;
  const questionId = `wk_${currentQuestionIndex}`;

  // Count votes for current question
  const getVoteCounts = () => {
    const counts: Record<string, number> = {};
    state.participants.forEach(p => {
      const vote = p.answers[questionId];
      if (vote) {
        counts[vote] = (counts[vote] || 0) + 1;
      }
    });
    return counts;
  };

  const handleVote = () => {
    if (!currentUser || !selectedPerson) return;
    if (onVote) onVote(selectedPerson);
    setVoted(prev => ({ ...prev, [currentQuestionIndex]: true }));
  };

  const handleNextQuestion = () => {
    setShowResults(false);
    setSelectedPerson(null);
    if (isLastQuestion) {
      onNext();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const voteCounts = getVoteCounts();
  const sortedResults = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
  const winner = sortedResults[0];

  // HOST VIEW
  if (viewMode === 'host') {
    return (
      <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">🔍 מי מכיר את מי?</h1>
          <QuoteCard quote={QUOTES[2]} size="small" className="max-w-xl" />
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-8 flex-wrap justify-center max-w-xl">
          {WHO_KNOWS_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-6 h-2 rounded-full transition-all ${
                i < currentQuestionIndex ? 'bg-emerald-500' :
                i === currentQuestionIndex ? 'bg-secondary' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <div className="glass-card p-8 rounded-3xl max-w-3xl w-full mb-8 text-center">
          <span className="text-6xl block mb-4">🤔</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">{question}</h2>
        </div>

        {/* Results */}
        {showResults ? (
          <div className="w-full max-w-2xl mb-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-center mb-6">התוצאות!</h3>
            
            {winner && (
              <div className="glass-card p-6 rounded-3xl mb-6 text-center border-2 border-yellow-400 bg-yellow-400/10">
                <span className="text-5xl block mb-2">👑</span>
                <span className="text-4xl block mb-2">
                  {state.participants.find(p => p.id === winner[0])?.emoji}
                </span>
                <h4 className="text-2xl font-bold text-yellow-400">
                  {state.participants.find(p => p.id === winner[0])?.name}
                </h4>
                <p className="text-white/60">{winner[1]} הצבעות</p>
              </div>
            )}

            <div className="space-y-3">
              {sortedResults.slice(1).map(([id, count], i) => {
                const person = state.participants.find(p => p.id === id);
                if (!person) return null;
                return (
                  <div key={id} className="glass p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{person.emoji}</span>
                      <span className="font-bold">{person.name}</span>
                    </div>
                    <span className="text-white/60">{count} הצבעות</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="glass-card px-8 py-4 rounded-full inline-block">
              <span className="text-2xl font-bold text-secondary">{Object.keys(voteCounts).length}</span>
              <span className="text-white/60 mr-2">הצביעו</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          {!showResults && Object.keys(voteCounts).length > 0 && (
            <button onClick={() => setShowResults(true)} className="btn-ghost">
              הצג תוצאות 📊
            </button>
          )}
          <button onClick={handleNextQuestion} className="btn-primary">
            {isLastQuestion ? 'לשלב הבא ←' : 'שאלה הבאה ←'}
          </button>
        </div>
      </div>
    );
  }

  // PARTICIPANT VIEW
  const alreadyVoted = voted[currentQuestionIndex] || currentUser?.answers[questionId];

  return (
    <div className="flex flex-col min-h-screen p-6 animate-fadeIn">
      {/* Progress */}
      <div className="flex gap-1 mb-6 justify-center flex-wrap">
        {WHO_KNOWS_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-1.5 rounded-full ${
              i < currentQuestionIndex ? 'bg-emerald-500' :
              i === currentQuestionIndex ? 'bg-secondary' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="glass-card p-6 rounded-2xl mb-6 text-center">
        <h2 className="text-xl font-bold text-white">{question}</h2>
      </div>

      {alreadyVoted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="text-emerald-400 font-bold text-xl">הצבעה נשלחה!</p>
          <p className="text-white/60 mt-2">ממתינים לשאלה הבאה...</p>
        </div>
      ) : (
        <>
          {/* Participants to vote */}
          <div className="flex-1 overflow-y-auto">
            <p className="text-center text-white/60 mb-4">בחר/י את מי שהכי מתאים:</p>
            <div className="grid grid-cols-2 gap-3">
              {state.participants
                .filter(p => p.id !== currentUser?.id)
                .map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPerson(p.id)}
                    className={`glass-card p-4 rounded-xl flex flex-col items-center transition-all ${
                      selectedPerson === p.id 
                        ? 'ring-2 ring-secondary bg-secondary/20 scale-105' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <span className="text-3xl mb-2">{p.emoji}</span>
                    <span className="font-bold text-sm">{p.name}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleVote}
            disabled={!selectedPerson}
            className={`w-full py-4 rounded-xl font-bold text-lg mt-4 transition-all ${
              selectedPerson
                ? 'bg-secondary hover:bg-indigo-600'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            הצבע 🗳️
          </button>
        </>
      )}
    </div>
  );
};

export default Stage2WhoKnows;
