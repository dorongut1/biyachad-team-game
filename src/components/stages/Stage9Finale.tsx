import React, { useState, useEffect } from 'react';
import { GameState, Participant, ViewMode, Team } from '../../types';
import { QUOTES } from '../../constants';
import QuoteCard from '../shared/QuoteCard';
import TeamScoreBoard from '../shared/TeamScoreBoard';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onRestart: () => void;
}

export const Stage9Finale: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onRestart
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  // Sort teams by score
  const sortedTeams = [...state.teams].sort((a, b) => b.score - a.score);
  const winningTeam = sortedTeams[0];
  const isTie = sortedTeams.length > 1 && sortedTeams[0].score === sortedTeams[1].score;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Confetti component
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          <span
            className="block w-3 h-3 transform rotate-45"
            style={{
              backgroundColor: ['#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#3b82f6'][i % 5]
            }}
          />
        </div>
      ))}
    </div>
  );

  // Certificate component
  const Certificate = ({ participant }: { participant: Participant }) => {
    const team = state.teams.find(t => t.id === participant.teamId);

    return (
      <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-8 rounded-3xl shadow-2xl text-center max-w-md mx-auto animate-scaleIn">
        <div className="border-4 border-amber-600 rounded-2xl p-6">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-black text-amber-800 mb-2">תעודת השתתפות</h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-4" />

          <p className="text-amber-700 text-lg mb-2">מוענקת בגאווה ל</p>
          <h3 className="text-3xl font-black text-amber-900 mb-4">{participant.name}</h3>

          <p className="text-amber-700">
            על השתתפות פעילה ותרומה מיוחדת
            <br />
            במשחק הגיבוש של
          </p>
          <p className="text-xl font-bold text-amber-800 mt-2">{state.companyName}</p>

          {team && (
            <div className={`inline-block ${team.bgColor} px-4 py-2 rounded-full mt-4`}>
              <span className="font-bold text-white">{team.name}</span>
            </div>
          )}

          <div className="mt-6 text-amber-600 text-sm">
            {new Date().toLocaleDateString('he-IL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    );
  };

  // HOST VIEW
  if (viewMode === 'host') {
    return (
      <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn relative">
        {showConfetti && <Confetti />}

        <div className="text-center mb-8">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">כל הכבוד!</h1>
          <p className="text-2xl text-indigo-300 mb-4">סיימנו את משחק הגיבוש!</p>
        </div>

        {/* Quote */}
        <QuoteCard quote={QUOTES[9]} size="large" className="max-w-2xl mb-8" />

        {/* Results */}
        <div className="glass-card p-8 rounded-3xl max-w-3xl w-full mb-8">
          {isTie ? (
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🤝</div>
              <h2 className="text-3xl font-bold text-amber-400">תיקו מושלם!</h2>
              <p className="text-white/80">כולם ניצחו הערב!</p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">🏆 הצוות המנצח</h2>
              <div className={`inline-block ${winningTeam.bgColor} px-8 py-4 rounded-2xl`}>
                <span className="text-4xl font-black">{winningTeam.name}</span>
                <p className="text-white/80 mt-1">{winningTeam.score} נקודות</p>
              </div>
            </div>
          )}

          <TeamScoreBoard teams={sortedTeams} showRank={true} />
        </div>

        {/* Participants grid */}
        <div className="max-w-4xl w-full mb-8">
          <h3 className="text-xl font-bold text-center mb-4">המשתתפים שלנו 🌟</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {state.participants.map((p, i) => (
              <div
                key={p.id}
                className="flex flex-col items-center animate-scaleIn"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-3xl mb-1">{p.emoji}</span>
                <span className="text-sm text-white/80">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl w-full mb-8">
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-4xl font-black text-secondary">{state.participants.length}</div>
            <div className="text-white/60">משתתפים</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-4xl font-black text-emerald-400">{state.teams.length}</div>
            <div className="text-white/60">צוותים</div>
          </div>
          <div className="glass-card p-6 rounded-2xl text-center">
            <div className="text-4xl font-black text-amber-400">9</div>
            <div className="text-white/60">שלבים</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button onClick={onRestart} className="btn-ghost">
            התחל משחק חדש 🔄
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white/40">
          <p>נוצר באהבה על ידי</p>
          <p className="text-lg font-bold text-indigo-300">תורת המשחקים 🎮</p>
        </div>
      </div>
    );
  }

  // PARTICIPANT VIEW
  const myTeam = state.teams.find(t => t.id === currentUser?.teamId);
  const isWinner = myTeam && myTeam.id === winningTeam?.id;

  if (showCertificate && currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fadeIn">
        <Certificate participant={currentUser} />
        <button
          onClick={() => setShowCertificate(false)}
          className="btn-ghost mt-6"
        >
          חזרה לתוצאות
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 animate-fadeIn relative">
      {showConfetti && <Confetti />}

      <div className="text-center mb-6">
        <div className="text-6xl mb-3 animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold text-white mb-2">סיימנו!</h1>
        <p className="text-indigo-300">איזה ערב מדהים!</p>
      </div>

      {/* Personal result */}
      {myTeam && (
        <div className={`glass-card p-6 rounded-2xl mb-6 text-center w-full ${
          isWinner ? 'border-2 border-amber-400' : ''
        }`}>
          {isWinner || isTie ? (
            <>
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-2xl font-bold text-amber-400 mb-2">
                {isTie ? 'תיקו!' : 'ניצחתם!'}
              </h2>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">⭐</div>
              <h2 className="text-2xl font-bold text-white mb-2">כל הכבוד!</h2>
            </>
          )}

          <div className={`inline-block ${myTeam.bgColor} px-6 py-3 rounded-xl`}>
            <span className="font-bold text-lg">{myTeam.name}</span>
            <p className="text-white/80">{myTeam.score} נקודות</p>
          </div>
        </div>
      )}

      {/* Quote */}
      <QuoteCard quote={QUOTES[9]} size="small" className="w-full mb-6" />

      {/* Team standings */}
      <div className="w-full mb-6">
        <h3 className="text-lg font-bold mb-3 text-center">דירוג הצוותים</h3>
        <TeamScoreBoard teams={sortedTeams} showRank={true} />
      </div>

      {/* Certificate button */}
      <button
        onClick={() => setShowCertificate(true)}
        className="btn-primary w-full mb-4"
      >
        הצג תעודת השתתפות 📜
      </button>

      {/* Footer */}
      <div className="mt-auto text-center text-white/40 text-sm">
        <p>נוצר על ידי תורת המשחקים 🎮</p>
      </div>
    </div>
  );
};

export default Stage9Finale;
