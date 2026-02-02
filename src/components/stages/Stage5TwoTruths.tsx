import React, { useState } from 'react';
import { GameState, Participant, ViewMode } from '../../types';
import { QUOTES } from '../../constants';
import QuoteCard from '../shared/QuoteCard';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onNext: () => void;
  onAddTeamScore: (teamId: string, points: number) => void;
}

interface TwoTruthsData {
  participantId: string;
  statements: string[];
  lieIndex: number;
}

export const Stage5TwoTruths: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onNext,
  onAddTeamScore
}) => {
  const [phase, setPhase] = useState<'input' | 'game'>('input');
  const [statements, setStatements] = useState(['', '', '']);
  const [lieIndex, setLieIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<TwoTruthsData[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedGuess, setSelectedGuess] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);

  // Demo data for showcasing
  const demoSubmissions: TwoTruthsData[] = state.participants.map((p, i) => ({
    participantId: p.id,
    statements: [
      ['טיפסתי על הר הגעש באיסלנד', 'יש לי אח תאום', 'למדתי לנגן על חליל'][i % 3],
      ['הייתי שחקן כדורגל נוער', 'ביקרתי ב-15 מדינות', 'אני יודע לרקוד סלסה'][i % 3],
      ['אני אוהב פיצה עם אננס', 'הייתי ממציא אפליקציה', 'יש לי כלב בשם שוקו'][i % 3]
    ],
    lieIndex: i % 3
  }));

  const currentSubmission = allSubmissions.length > 0
    ? allSubmissions[currentPlayerIndex]
    : demoSubmissions[currentPlayerIndex];

  const currentPlayer = state.participants.find(p => p.id === currentSubmission?.participantId);
  const isLastPlayer = currentPlayerIndex >= state.participants.length - 1;

  const handleStatementChange = (index: number, value: string) => {
    const newStatements = [...statements];
    newStatements[index] = value;
    setStatements(newStatements);
  };

  const handleSubmit = () => {
    if (statements.every(s => s.trim()) && lieIndex !== null) {
      setHasSubmitted(true);
      // In real app, would send to server
    }
  };

  const handleGuess = (guessIndex: number) => {
    if (hasGuessed) return;
    setSelectedGuess(guessIndex);
    setHasGuessed(true);

    if (guessIndex === currentSubmission.lieIndex && currentUser?.teamId) {
      onAddTeamScore(currentUser.teamId, 5);
    }
  };

  const handleReveal = () => {
    setShowResult(true);
  };

  const handleNextPlayer = () => {
    if (isLastPlayer) {
      onNext();
    } else {
      setCurrentPlayerIndex(prev => prev + 1);
      setShowResult(false);
      setSelectedGuess(null);
      setHasGuessed(false);
    }
  };

  // HOST VIEW
  if (viewMode === 'host') {
    if (phase === 'input') {
      return (
        <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">🤥 שתי אמיתות ושקר</h1>
            <QuoteCard quote={QUOTES[5]} size="small" className="max-w-xl" />
          </div>

          <div className="glass-card p-8 rounded-3xl max-w-2xl text-center">
            <div className="text-6xl mb-6 animate-float">✍️</div>
            <h2 className="text-2xl font-bold mb-4">שלב ההכנות</h2>
            <p className="text-lg text-white/80 mb-6">
              המשתתפים כותבים עכשיו שלושה משפטים על עצמם - שניים אמיתיים ואחד שקרי.
            </p>

            <div className="glass p-6 rounded-2xl mb-6">
              <p className="text-indigo-300 text-lg mb-2">
                {hasSubmitted ? '✅' : '⏳'} {state.participants.filter(() => Math.random() > 0.5).length} / {state.participants.length} הגישו
              </p>
            </div>

            <button
              onClick={() => setPhase('game')}
              className="btn-primary text-xl px-12"
            >
              מתחילים לנחש! 🎯
            </button>
          </div>
        </div>
      );
    }

    // Game phase
    return (
      <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black text-white mb-2">🤥 מי יזהה את השקר?</h1>
          <p className="text-indigo-300">שחקן {currentPlayerIndex + 1} מתוך {state.participants.length}</p>
        </div>

        {/* Current player card */}
        <div className="glass-card p-8 rounded-3xl max-w-2xl w-full mb-6 text-center">
          <div className="text-6xl mb-4">{currentPlayer?.emoji}</div>
          <h2 className="text-3xl font-bold text-white mb-6">{currentPlayer?.name}</h2>

          <div className="space-y-4">
            {currentSubmission.statements.map((statement, i) => (
              <div
                key={i}
                className={`p-5 rounded-2xl text-xl font-medium transition-all ${
                  showResult
                    ? i === currentSubmission.lieIndex
                      ? 'bg-red-500/30 border-2 border-red-400'
                      : 'bg-emerald-500/30 border-2 border-emerald-400'
                    : 'glass'
                }`}
              >
                <span className="text-2xl ml-3">{i + 1}.</span>
                {statement}
                {showResult && (
                  <span className="float-left">
                    {i === currentSubmission.lieIndex ? '❌ שקר!' : '✅'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {!showResult ? (
            <button onClick={handleReveal} className="btn-primary">
              גלה את השקר! 🎭
            </button>
          ) : (
            <button onClick={handleNextPlayer} className="btn-primary">
              {isLastPlayer ? 'לשלב הבא ←' : 'השחקן הבא ←'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // PARTICIPANT VIEW - Input phase
  if (!hasSubmitted) {
    return (
      <div className="flex flex-col min-h-screen p-6 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🤥</div>
          <h1 className="text-2xl font-bold">שתי אמיתות ושקר</h1>
          <p className="text-indigo-300 mt-2">כתבו 3 משפטים - 2 אמיתיים ו-1 שקרי</p>
        </div>

        <div className="flex-1 space-y-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-secondary">{i + 1}.</span>
                <button
                  onClick={() => setLieIndex(i)}
                  className={`text-xs px-2 py-1 rounded ${
                    lieIndex === i
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {lieIndex === i ? '🤥 השקר' : 'סמן כשקר'}
                </button>
              </div>
              <textarea
                value={statements[i]}
                onChange={(e) => handleStatementChange(i, e.target.value)}
                placeholder={`משפט ${i + 1}...`}
                className="input-glass h-20 resize-none"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!statements.every(s => s.trim()) || lieIndex === null}
          className={`w-full py-4 rounded-2xl font-bold text-lg mt-4 ${
            statements.every(s => s.trim()) && lieIndex !== null
              ? 'btn-primary'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          שלח! 📤
        </button>
      </div>
    );
  }

  // PARTICIPANT VIEW - Game phase (guessing)
  if (currentPlayer?.id === currentUser?.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <div className="text-6xl mb-4 animate-bounce">🎭</div>
        <h2 className="text-2xl font-bold mb-2">התור שלך!</h2>
        <p className="text-white/60">האחרים מנסים לנחש מה השקר שלך...</p>
        <p className="text-indigo-300 mt-4">שמור על פוקר פייס! 😎</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6 animate-fadeIn">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">מה השקר של {currentPlayer?.name}?</h2>
        <span className="text-4xl">{currentPlayer?.emoji}</span>
      </div>

      <div className="flex-1 space-y-3">
        {currentSubmission.statements.map((statement, i) => (
          <button
            key={i}
            onClick={() => handleGuess(i)}
            disabled={hasGuessed}
            className={`w-full p-5 rounded-2xl text-right font-medium transition-all ${
              hasGuessed
                ? selectedGuess === i
                  ? i === currentSubmission.lieIndex
                    ? 'bg-emerald-500'
                    : 'bg-red-500'
                  : i === currentSubmission.lieIndex
                    ? 'bg-emerald-500/50'
                    : 'bg-white/10 opacity-50'
                : 'glass hover:bg-secondary/30 active:scale-98'
            }`}
          >
            <span className="text-lg">{i + 1}. {statement}</span>
          </button>
        ))}
      </div>

      {hasGuessed && (
        <div className="text-center mt-4 animate-fadeIn">
          <p className={`font-bold text-lg ${
            selectedGuess === currentSubmission.lieIndex ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {selectedGuess === currentSubmission.lieIndex
              ? '🎉 נכון! +5 נקודות לצוות!'
              : '😅 לא נורא, בפעם הבאה!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Stage5TwoTruths;
