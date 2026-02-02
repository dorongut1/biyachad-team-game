import React, { useState } from 'react';
import { GameState, Participant, ViewMode } from '../../types';
import { QUOTES, REFLECTION_QUESTIONS } from '../../constants';
import QuoteCard from '../shared/QuoteCard';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onNext: () => void;
}

interface ReflectionAnswer {
  participantId: string;
  participantName: string;
  emoji: string;
  answers: Record<number, string>;
}

export const Stage8Reflection: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onNext
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [revealMode, setRevealMode] = useState(false);
  const [revealQuestionIndex, setRevealQuestionIndex] = useState(0);

  const currentQuestion = REFLECTION_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= REFLECTION_QUESTIONS.length - 1;

  // Demo reflection answers
  const demoReflections: ReflectionAnswer[] = state.participants.map((p, i) => ({
    participantId: p.id,
    participantName: p.name,
    emoji: p.emoji,
    answers: {
      0: ['הגיבוש הזה הזכיר לי למה אני אוהב לעבוד פה', 'למדתי דברים חדשים על הקולגות', 'אני מרגיש יותר מחובר לצוות'][i % 3],
      1: ['לתקשר יותר', 'להכיר עוד אנשים', 'לעזור יותר לאחרים'][i % 3],
      2: ['את האנרגיה החיובית', 'את השיתוף פעולה', 'את הרגעים המשותפים'][i % 3]
    }
  }));

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setHasSubmitted(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // HOST VIEW
  if (viewMode === 'host') {
    if (!revealMode) {
      return (
        <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">💭 רגע של מחשבה</h1>
            <QuoteCard quote={QUOTES[8]} size="small" className="max-w-xl" />
          </div>

          <div className="glass-card p-8 rounded-3xl max-w-2xl text-center">
            <div className="text-6xl mb-6 animate-float">🤔</div>
            <h2 className="text-2xl font-bold mb-4">זמן לרפלקציה</h2>
            <p className="text-lg text-white/80 mb-6">
              המשתתפים עונים עכשיו על מספר שאלות מחשבה.
              <br />
              זה הזמן לעצור ולהרהר על החוויה.
            </p>

            <div className="glass p-6 rounded-2xl mb-6 space-y-3">
              {REFLECTION_QUESTIONS.map((q, i) => (
                <div key={i} className="text-right text-white/70">
                  <span className="text-secondary ml-2">{i + 1}.</span>
                  {q}
                </div>
              ))}
            </div>

            <button
              onClick={() => setRevealMode(true)}
              className="btn-primary text-xl px-12"
            >
              נראה תשובות! 📖
            </button>
          </div>
        </div>
      );
    }

    // Reveal mode
    const currentRevealQuestion = REFLECTION_QUESTIONS[revealQuestionIndex];
    const isLastRevealQuestion = revealQuestionIndex >= REFLECTION_QUESTIONS.length - 1;

    return (
      <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-white mb-2">💭 מה אמרו המשתתפים?</h1>
          <p className="text-indigo-300">שאלה {revealQuestionIndex + 1} מתוך {REFLECTION_QUESTIONS.length}</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {REFLECTION_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-2 rounded-full transition-all ${
                i < revealQuestionIndex ? 'bg-emerald-500' :
                i === revealQuestionIndex ? 'bg-secondary' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <div className="glass-card p-6 rounded-2xl max-w-3xl w-full mb-6 text-center">
          <h2 className="text-2xl font-bold text-white">{currentRevealQuestion}</h2>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full mb-8">
          {demoReflections.map((reflection, i) => (
            <div
              key={reflection.participantId}
              className="glass-card p-5 rounded-2xl animate-scaleIn"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{reflection.emoji}</span>
                <span className="font-bold">{reflection.participantName}</span>
              </div>
              <p className="text-white/80 text-sm">
                {reflection.answers[revealQuestionIndex] || 'לא ענה עדיין...'}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {revealQuestionIndex > 0 && (
            <button
              onClick={() => setRevealQuestionIndex(prev => prev - 1)}
              className="btn-ghost"
            >
              ← הקודם
            </button>
          )}

          {isLastRevealQuestion ? (
            <button onClick={onNext} className="btn-primary text-xl">
              לסיום! 🎉
            </button>
          ) : (
            <button
              onClick={() => setRevealQuestionIndex(prev => prev + 1)}
              className="btn-primary"
            >
              הבא ←
            </button>
          )}
        </div>
      </div>
    );
  }

  // PARTICIPANT VIEW - Submitted
  if (hasSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fadeIn">
        <div className="text-6xl mb-6 animate-bounce">✅</div>
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">תודה על השיתוף!</h2>
        <p className="text-white/60 mb-6">התשובות שלך נשמרו</p>

        <div className="glass-card p-6 rounded-2xl max-w-sm">
          <h3 className="text-lg font-bold mb-3">התשובות שלך:</h3>
          <div className="space-y-3 text-right">
            {REFLECTION_QUESTIONS.map((q, i) => (
              <div key={i} className="text-sm">
                <p className="text-white/60 mb-1">{q}</p>
                <p className="text-white">{answers[i] || '-'}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 mt-6">ממתינים למארח להמשיך...</p>
      </div>
    );
  }

  // PARTICIPANT VIEW - Answering
  return (
    <div className="flex flex-col min-h-screen p-6 animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">💭</div>
        <h1 className="text-xl font-bold">רגע של מחשבה</h1>
        <p className="text-indigo-300 mt-1">שאלה {currentQuestionIndex + 1} מתוך {REFLECTION_QUESTIONS.length}</p>
      </div>

      {/* Progress */}
      <div className="flex gap-2 justify-center mb-6">
        {REFLECTION_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`w-6 h-1.5 rounded-full transition-all ${
              i < currentQuestionIndex ? 'bg-emerald-500' :
              i === currentQuestionIndex ? 'bg-secondary' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="glass-card p-6 rounded-2xl mb-6">
        <h2 className="text-xl font-bold text-white text-center">{currentQuestion}</h2>
      </div>

      {/* Answer input */}
      <textarea
        value={answers[currentQuestionIndex] || ''}
        onChange={(e) => handleAnswer(e.target.value)}
        placeholder="שתפו את המחשבות שלכם..."
        className="input-glass flex-1 min-h-32 resize-none"
        maxLength={300}
      />

      <p className="text-left text-xs text-white/40 mt-1">
        {(answers[currentQuestionIndex] || '').length}/300
      </p>

      {/* Navigation */}
      <div className="flex gap-4 mt-6">
        {currentQuestionIndex > 0 && (
          <button onClick={handlePrevious} className="btn-ghost flex-1">
            ← הקודם
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestionIndex]?.trim()}
          className={`flex-1 py-4 rounded-2xl font-bold text-lg ${
            answers[currentQuestionIndex]?.trim()
              ? 'btn-primary'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? 'סיום ←' : 'הבא ←'}
        </button>
      </div>
    </div>
  );
};

export default Stage8Reflection;
