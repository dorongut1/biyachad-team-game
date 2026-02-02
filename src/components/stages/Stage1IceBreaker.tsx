import React, { useState } from 'react';
import { GameState, Participant, ViewMode } from '../../types';
import { QUOTES, ICE_BREAKER_QUESTIONS } from '../../constants';
import QuoteCard from '../shared/QuoteCard';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onNext: () => void;
  onAnswer: (questionId: string, answer: string) => void;
}

export const Stage1IceBreaker: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onNext,
  onAnswer
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const question = ICE_BREAKER_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= ICE_BREAKER_QUESTIONS.length - 1;

  const handleSubmit = () => {
    if (!currentUser || !answer.trim()) return;

    onAnswer(question.id, answer);
    setSubmitted(prev => ({ ...prev, [question.id]: true }));
    setAnswer('');
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      onNext();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Get answers for current question
  const getAnswersForQuestion = (qId: string) => {
    return state.participants
      .filter(p => p.answers[qId])
      .map(p => ({ name: p.name, emoji: p.emoji, answer: p.answers[qId] }));
  };

  // HOST VIEW
  if (viewMode === 'host') {
    const answers = getAnswersForQuestion(question.id);
    
    return (
      <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">🧊 שבירת קרח</h1>
          <QuoteCard quote={QUOTES[1]} size="small" className="max-w-xl" />
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {ICE_BREAKER_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-12 h-2 rounded-full transition-all ${
                i < currentQuestionIndex ? 'bg-emerald-500' :
                i === currentQuestionIndex ? 'bg-secondary' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Current Question */}
        <div className="glass-card p-8 rounded-3xl max-w-3xl w-full mb-8">
          <div className="text-center">
            <span className="text-6xl mb-4 block">{question.type === 'choice' ? '🎯' : '✏️'}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{question.text}</h2>
            
            {question.type === 'choice' && question.options && (
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {question.options.map(opt => (
                  <div key={opt} className="glass px-6 py-3 rounded-xl text-lg">
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Answers display */}
        {answers.length > 0 && (
          <div className="w-full max-w-4xl mb-8">
            <h3 className="text-xl font-bold text-white/80 mb-4 text-center">
              {answers.length} תשובות התקבלו
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {answers.map((a, i) => (
                <div 
                  key={i} 
                  className="glass-card p-4 rounded-2xl animate-scaleIn"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{a.emoji}</span>
                    <span className="font-bold text-sm">{a.name}</span>
                  </div>
                  <p className="text-white/80 text-sm">{a.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <button
          onClick={handleNextQuestion}
          className="btn-primary text-xl"
        >
          {isLastQuestion ? 'לשלב הבא ←' : 'שאלה הבאה ←'}
        </button>
      </div>
    );
  }

  // PARTICIPANT VIEW
  const alreadyAnswered = submitted[question.id] || currentUser?.answers[question.id];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fadeIn">
      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {ICE_BREAKER_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`w-8 h-1.5 rounded-full ${
              i < currentQuestionIndex ? 'bg-emerald-500' :
              i === currentQuestionIndex ? 'bg-secondary' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="glass-card p-6 rounded-3xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">{question.text}</h2>

        {alreadyAnswered ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-emerald-400 font-bold text-xl">תשובה נשלחה!</p>
            <p className="text-white/60 mt-2">ממתינים לשאלה הבאה...</p>
          </div>
        ) : (
          <>
            {question.type === 'choice' && question.options ? (
              <div className="space-y-3">
                {question.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setAnswer(opt);
                      if (currentUser) {
                        onAnswer(question.id, opt);
                        setSubmitted(prev => ({ ...prev, [question.id]: true }));
                      }
                    }}
                    className={`w-full p-4 rounded-xl font-bold text-lg transition-all ${
                      answer === opt 
                        ? 'bg-secondary text-white' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="input-glass h-32 resize-none text-lg"
                  placeholder="הקלד/י את תשובתך..."
                />
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    answer.trim()
                      ? 'bg-secondary hover:bg-indigo-600'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  שלח תשובה
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Stage1IceBreaker;
