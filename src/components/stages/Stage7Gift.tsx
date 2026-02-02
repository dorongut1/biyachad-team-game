import React, { useState, useEffect } from 'react';
import { GameState, Participant, ViewMode } from '../../types';
import { QUOTES } from '../../constants';
import QuoteCard from '../shared/QuoteCard';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onNext: () => void;
  onSendFeedback: (toId: string, message: string) => void;
}

interface FeedbackEntry {
  fromId: string;
  fromName: string;
  message: string;
}

export const Stage7Gift: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onNext,
  onSendFeedback
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState<Participant | null>(null);
  const [message, setMessage] = useState('');
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [showSentAnimation, setShowSentAnimation] = useState(false);
  const [revealIndex, setRevealIndex] = useState(-1);

  const otherParticipants = state.participants.filter(p => p.id !== currentUser?.id);
  const allSent = sentTo.size >= Math.min(3, otherParticipants.length);

  // Predefined positive messages
  const quickMessages = [
    '💫 אתה מביא אנרגיה חיובית לצוות!',
    '🌟 נהניתי לעבוד איתך!',
    '🤝 תמיד אפשר לסמוך עליך',
    '😄 אתה גורם לאווירה להיות טובה יותר',
    '💪 הכוח שלך הוא ההתמדה',
    '✨ יש לך יכולת מיוחדת לחבר אנשים',
    '🎯 הרעיונות שלך תמיד מפתיעים לטובה',
    '🌈 את מקרינה חום ונעימות'
  ];

  const handleSend = () => {
    if (selectedRecipient && message.trim()) {
      onSendFeedback(selectedRecipient.id, message);
      setSentTo(prev => new Set(prev).add(selectedRecipient.id));
      setShowSentAnimation(true);
      setTimeout(() => {
        setShowSentAnimation(false);
        setSelectedRecipient(null);
        setMessage('');
      }, 1500);
    }
  };

  const handleQuickMessage = (msg: string) => {
    setMessage(msg);
  };

  // HOST VIEW
  if (viewMode === 'host') {
    const participantsWithFeedback = state.participants.filter(
      p => p.receivedFeedback && p.receivedFeedback.length > 0
    );

    return (
      <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">🎁 מתנת מילים</h1>
          <QuoteCard quote={QUOTES[7]} size="small" className="max-w-xl" />
        </div>

        {revealIndex < 0 ? (
          <div className="glass-card p-8 rounded-3xl max-w-2xl text-center">
            <div className="text-6xl mb-6 animate-float">✉️</div>
            <h2 className="text-2xl font-bold mb-4">שלב ההודעות</h2>
            <p className="text-lg text-white/80 mb-6">
              המשתתפים כותבים הודעות חיוביות זה לזה.
              <br />
              בואו ניתן לכולם רגע לשלוח מילים טובות!
            </p>

            <div className="glass p-6 rounded-2xl mb-6">
              <p className="text-indigo-300 text-lg">
                📬 {participantsWithFeedback.length} אנשים קיבלו הודעות
              </p>
            </div>

            <button
              onClick={() => setRevealIndex(0)}
              className="btn-primary text-xl px-12"
            >
              בואו נגלה! 🎉
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl">
            {/* Reveal participant feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {state.participants.slice(0, revealIndex + 1).map((participant, i) => (
                <div
                  key={participant.id}
                  className="glass-card p-6 rounded-2xl animate-scaleIn"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{participant.emoji}</span>
                    <h3 className="text-xl font-bold">{participant.name}</h3>
                  </div>

                  {participant.receivedFeedback && participant.receivedFeedback.length > 0 ? (
                    <div className="space-y-3">
                      {participant.receivedFeedback.map((fb, j) => (
                        <div key={j} className="glass p-3 rounded-xl text-sm">
                          <p className="text-white/90">{fb.message}</p>
                          <p className="text-indigo-300 text-xs mt-1">- {fb.fromName}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/60 text-sm">עוד לא הגיעו הודעות 💌</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              {revealIndex < state.participants.length - 1 ? (
                <button
                  onClick={() => setRevealIndex(prev => prev + 1)}
                  className="btn-primary"
                >
                  גלה עוד ←
                </button>
              ) : (
                <button onClick={onNext} className="btn-primary text-xl">
                  לשלב הבא ←
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // PARTICIPANT VIEW - Sent animation
  if (showSentAnimation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fadeIn">
        <div className="text-8xl mb-6 animate-bounce">💌</div>
        <h2 className="text-2xl font-bold text-emerald-400">נשלח בהצלחה!</h2>
        <p className="text-white/60 mt-2">ההודעה שלך בדרך ל{selectedRecipient?.name}</p>
      </div>
    );
  }

  // PARTICIPANT VIEW - Selection screen
  if (!selectedRecipient) {
    return (
      <div className="flex flex-col min-h-screen p-6 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎁</div>
          <h1 className="text-2xl font-bold">מתנת מילים</h1>
          <p className="text-indigo-300 mt-2">בחרו למי לשלוח הודעה חיובית</p>
        </div>

        {allSent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-bold text-emerald-400 mb-2">כל הכבוד!</h2>
            <p className="text-white/60">שלחת הודעות ל-{sentTo.size} אנשים</p>
            <p className="text-white/40 mt-4">ממתינים למארח להמשיך...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 flex-1 content-start">
            {otherParticipants.map(participant => (
              <button
                key={participant.id}
                onClick={() => setSelectedRecipient(participant)}
                disabled={sentTo.has(participant.id)}
                className={`p-4 rounded-2xl text-center transition-all ${
                  sentTo.has(participant.id)
                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                    : 'glass hover:bg-secondary/30 active:scale-95'
                }`}
              >
                <span className="text-3xl block mb-2">{participant.emoji}</span>
                <span className="font-medium">{participant.name}</span>
                {sentTo.has(participant.id) && (
                  <span className="block text-emerald-400 text-xs mt-1">✓ נשלח</span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="glass-card p-4 rounded-2xl mt-4">
          <p className="text-center text-sm text-white/60">
            שלחת ל-{sentTo.size} מתוך {Math.min(3, otherParticipants.length)} (מינימום)
          </p>
        </div>
      </div>
    );
  }

  // PARTICIPANT VIEW - Writing message
  return (
    <div className="flex flex-col min-h-screen p-6 animate-fadeIn">
      <button
        onClick={() => setSelectedRecipient(null)}
        className="self-start text-indigo-300 mb-4"
      >
        → חזרה לרשימה
      </button>

      <div className="text-center mb-6">
        <span className="text-5xl block mb-2">{selectedRecipient.emoji}</span>
        <h2 className="text-xl font-bold">{selectedRecipient.name}</h2>
        <p className="text-indigo-300 mt-1">כתבו משהו חיובי!</p>
      </div>

      {/* Quick messages */}
      <div className="mb-4">
        <p className="text-sm text-white/60 mb-2">💡 הצעות מהירות:</p>
        <div className="flex flex-wrap gap-2">
          {quickMessages.slice(0, 4).map((msg, i) => (
            <button
              key={i}
              onClick={() => handleQuickMessage(msg)}
              className="text-xs px-3 py-2 rounded-full glass hover:bg-secondary/30 transition-all"
            >
              {msg.slice(0, 20)}...
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="כתבו הודעה אישית..."
        className="input-glass h-32 resize-none flex-1"
        maxLength={200}
      />

      <p className="text-left text-xs text-white/40 mt-1">{message.length}/200</p>

      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className={`w-full py-4 rounded-2xl font-bold text-lg mt-4 ${
          message.trim()
            ? 'btn-primary'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        שלח הודעה 💌
      </button>
    </div>
  );
};

export default Stage7Gift;
