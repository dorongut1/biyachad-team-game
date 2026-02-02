import React, { useState } from 'react';
import { GameState, Participant, ViewMode } from '../../types';
import { QUOTES, EMOJI_OPTIONS } from '../../constants';
import QuoteCard from '../shared/QuoteCard';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onJoin: (name: string, emoji: string, bio: string) => void;
  onStart: () => void;
  onSetCompanyName: (name: string) => void;
  onAddMockParticipants: () => void;
}

export const Stage0Welcome: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onJoin,
  onStart,
  onSetCompanyName,
  onAddMockParticipants
}) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [bio, setBio] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [editingName, setEditingName] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name, selectedEmoji, bio);
      setHasJoined(true);
    }
  };

  // HOST VIEW - מסך ראשי
  if (viewMode === 'host') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center animate-fadeIn">
        {/* Header */}
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-float">🤝</div>
          
          {editingName ? (
            <input
              type="text"
              value={state.companyName}
              onChange={(e) => onSetCompanyName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
              autoFocus
              className="text-5xl md:text-7xl font-black text-center bg-transparent border-b-2 border-secondary outline-none"
            />
          ) : (
            <h1 
              className="text-5xl md:text-7xl font-black text-white mb-2 cursor-pointer hover:text-secondary transition-colors"
              onClick={() => setEditingName(true)}
            >
              {state.companyName}
            </h1>
          )}
          
          <h2 className="text-3xl text-indigo-300 font-bold">ביחד.</h2>
          <p className="text-lg text-white/60 mt-2">לחצו על השם לעריכה</p>
        </div>

        {/* Quote */}
        <QuoteCard quote={QUOTES[0]} className="max-w-2xl mb-8" />

        {/* Participants counter */}
        <div className="glass-card px-8 py-4 rounded-full mb-8 animate-pulse">
          <span className="text-5xl font-black text-secondary">{state.participants.length}</span>
          <span className="text-xl text-white/80 mr-3">משתתפים הצטרפו</span>
        </div>

        {/* Participants grid */}
        {state.participants.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8 max-w-4xl">
            {state.participants.map((p, i) => (
              <div 
                key={p.id} 
                className="flex flex-col items-center animate-scaleIn"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="text-4xl mb-1 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                  {p.emoji}
                </span>
                <span className="text-sm text-white/80 font-medium">{p.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onStart}
            disabled={state.participants.length < 2}
            className={`px-12 py-5 rounded-2xl text-2xl font-black transition-all shadow-xl ${
              state.participants.length >= 2
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            בואו נתחיל! 🚀
          </button>

          {state.participants.length === 0 && (
            <button
              onClick={onAddMockParticipants}
              className="px-8 py-5 rounded-2xl text-lg font-bold bg-white/10 hover:bg-white/20 transition-all"
            >
              הוסף משתתפי דמו 👥
            </button>
          )}
        </div>

        {state.participants.length < 2 && (
          <p className="text-amber-400 mt-4 text-sm">צריך לפחות 2 משתתפים כדי להתחיל</p>
        )}
      </div>
    );
  }

  // PARTICIPANT VIEW - מסך נייד
  if (hasJoined || currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fadeIn">
        <div className="text-8xl mb-6 animate-bounce">✨</div>
        <h2 className="text-3xl font-bold mb-4">איזה כיף שהצטרפת!</h2>
        <p className="text-xl text-indigo-300 mb-2">{currentUser?.name || name}</p>
        <p className="text-lg text-white/60">ממתינים שהמארח יתחיל את המשחק...</p>
        
        <div className="glass-card p-6 rounded-2xl mt-8 max-w-sm">
          <p className="text-sm text-white/60 mb-2">טיפ:</p>
          <p className="text-white/80">בזמן ההמתנה, חשבו על משהו מעניין שאנשים לא יודעים עליכם!</p>
        </div>
      </div>
    );
  }

  // JOIN FORM
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fadeIn">
      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl w-full max-w-md space-y-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold text-white mb-2">הצטרפו למשחק</h1>
          <p className="text-indigo-300">ברוכים הבאים לערב של חיבור!</p>
        </div>

        {/* Name input */}
        <div>
          <label className="block text-indigo-200 mb-2 font-medium">מה השם שלך?</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-glass text-lg"
            placeholder="שם פרטי"
          />
        </div>

        {/* Emoji selection */}
        <div>
          <label className="block text-indigo-200 mb-2 font-medium">איך את/ה מרגיש/ה היום?</label>
          <div className="flex flex-wrap gap-2 justify-center">
            {EMOJI_OPTIONS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`text-2xl p-2 rounded-xl transition-all ${
                  selectedEmoji === emoji 
                    ? 'bg-secondary scale-125 shadow-lg' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Bio input */}
        <div>
          <label className="block text-indigo-200 mb-2 font-medium">משהו שהיית רוצה שידעו עליך?</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-glass h-24 resize-none"
            placeholder="משפט קצר על עצמך..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!name.trim()}
          className={`w-full py-4 rounded-2xl font-bold text-xl transition-all ${
            name.trim()
              ? 'bg-secondary hover:bg-indigo-600 text-white shadow-lg hover:scale-105'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          אני בפנים! 🎉
        </button>
      </form>
    </div>
  );
};

export default Stage0Welcome;
