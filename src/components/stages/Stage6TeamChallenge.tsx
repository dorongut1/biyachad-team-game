import React, { useState, useEffect } from 'react';
import { GameState, Participant, ViewMode } from '../../types';
import { QUOTES, TEAM_CHALLENGES } from '../../constants';
import QuoteCard from '../shared/QuoteCard';
import TeamScoreBoard from '../shared/TeamScoreBoard';
import Timer from '../shared/Timer';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onNext: () => void;
  onAddTeamScore: (teamId: string, points: number) => void;
}

export const Stage6TeamChallenge: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onNext,
  onAddTeamScore
}) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'challenge' | 'judge'>('intro');
  const [timerActive, setTimerActive] = useState(false);
  const [winningTeamId, setWinningTeamId] = useState<string | null>(null);

  const challenge = TEAM_CHALLENGES[currentChallengeIndex];
  const isLastChallenge = currentChallengeIndex >= TEAM_CHALLENGES.length - 1;

  const handleStartChallenge = () => {
    setPhase('challenge');
    setTimerActive(true);
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    setPhase('judge');
  };

  const handleSelectWinner = (teamId: string) => {
    setWinningTeamId(teamId);
    onAddTeamScore(teamId, challenge.points);
  };

  const handleNextChallenge = () => {
    if (isLastChallenge) {
      onNext();
    } else {
      setCurrentChallengeIndex(prev => prev + 1);
      setPhase('intro');
      setWinningTeamId(null);
      setTimerActive(false);
    }
  };

  // HOST VIEW
  if (viewMode === 'host') {
    return (
      <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">🎪 אתגרי צוות!</h1>
          <QuoteCard quote={QUOTES[6]} size="small" className="max-w-xl" />
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {TEAM_CHALLENGES.map((_, i) => (
            <div
              key={i}
              className={`w-10 h-2 rounded-full transition-all ${
                i < currentChallengeIndex ? 'bg-emerald-500' :
                i === currentChallengeIndex ? 'bg-secondary' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Scores */}
        <div className="w-full max-w-2xl mb-6">
          <TeamScoreBoard teams={state.teams} showRank={false} />
        </div>

        {/* Challenge Card */}
        <div className="glass-card p-8 rounded-3xl max-w-3xl w-full text-center">
          {phase === 'intro' && (
            <div className="animate-fadeIn">
              <div className="text-6xl mb-4">{challenge.emoji}</div>
              <h2 className="text-3xl font-bold text-white mb-4">{challenge.title}</h2>
              <p className="text-xl text-white/80 mb-4">{challenge.description}</p>
              <div className="glass p-4 rounded-xl inline-block mb-6">
                <span className="text-secondary font-bold">⏱️ {challenge.timeLimit} שניות</span>
                <span className="text-white/60 mx-3">|</span>
                <span className="text-amber-400 font-bold">🏆 {challenge.points} נקודות</span>
              </div>
              <br />
              <button onClick={handleStartChallenge} className="btn-primary text-xl px-12">
                התחל אתגר! 🚀
              </button>
            </div>
          )}

          {phase === 'challenge' && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-white mb-4">{challenge.title}</h2>
              <p className="text-xl text-white/60 mb-6">{challenge.description}</p>

              <Timer
                duration={challenge.timeLimit}
                onComplete={handleTimeUp}
                size="large"
                autoStart
              />

              <div className="flex justify-center gap-8 mt-8">
                {state.teams.map(team => (
                  <div key={team.id} className={`${team.bgColor} p-6 rounded-2xl min-w-32`}>
                    <p className="font-bold text-lg">{team.name}</p>
                    <p className="text-sm opacity-80">מבצעים...</p>
                  </div>
                ))}
              </div>

              <button onClick={handleTimeUp} className="btn-ghost mt-8">
                סיים מוקדם
              </button>
            </div>
          )}

          {phase === 'judge' && (
            <div className="animate-fadeIn">
              <div className="text-6xl mb-4">🏅</div>
              <h2 className="text-3xl font-bold text-white mb-6">מי ניצח באתגר?</h2>

              <div className="flex justify-center gap-6 mb-8">
                {state.teams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => handleSelectWinner(team.id)}
                    disabled={winningTeamId !== null}
                    className={`p-6 rounded-2xl min-w-40 transition-all ${
                      winningTeamId === team.id
                        ? 'bg-emerald-500 scale-110 shadow-xl'
                        : winningTeamId !== null
                          ? 'opacity-50'
                          : `${team.bgColor} hover:scale-105`
                    }`}
                  >
                    <p className="font-bold text-xl">{team.name}</p>
                    {winningTeamId === team.id && (
                      <p className="text-emerald-200 mt-2 animate-pulse">+{challenge.points} נקודות!</p>
                    )}
                  </button>
                ))}

                {!winningTeamId && (
                  <button
                    onClick={() => {
                      // Give both teams half points
                      state.teams.forEach(t => onAddTeamScore(t.id, Math.floor(challenge.points / 2)));
                      setWinningTeamId('tie');
                    }}
                    className="p-6 rounded-2xl min-w-40 bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <p className="font-bold text-xl">תיקו! 🤝</p>
                    <p className="text-sm text-white/60">חצי נקודות לכולם</p>
                  </button>
                )}
              </div>

              {winningTeamId && (
                <button onClick={handleNextChallenge} className="btn-primary text-xl">
                  {isLastChallenge ? 'לשלב הבא ←' : 'לאתגר הבא ←'}
                </button>
              )}
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

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {phase === 'intro' && (
          <div className="animate-fadeIn">
            <div className="text-6xl mb-4 animate-float">{challenge.emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-4">{challenge.title}</h2>
            <p className="text-lg text-white/80 mb-4">{challenge.description}</p>
            <div className="glass-card p-4 rounded-xl">
              <span className="text-secondary font-bold">⏱️ {challenge.timeLimit} שניות</span>
            </div>
            <p className="text-white/60 mt-6">ממתינים למארח להתחיל...</p>
          </div>
        )}

        {phase === 'challenge' && timerActive && (
          <div className="animate-fadeIn w-full">
            <h2 className="text-2xl font-bold text-white mb-4">{challenge.title}</h2>

            <Timer
              duration={challenge.timeLimit}
              onComplete={handleTimeUp}
              size="large"
              autoStart
            />

            <div className="glass-card p-6 rounded-2xl mt-8">
              <p className="text-xl text-amber-400 font-bold animate-pulse">
                בצעו את האתגר! 💪
              </p>
              <p className="text-white/60 mt-2">תתאמו עם הצוות שלכם</p>
            </div>
          </div>
        )}

        {phase === 'judge' && (
          <div className="animate-fadeIn">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-xl font-bold mb-2">נגמר הזמן!</h2>
            <p className="text-white/60">המארח בוחר את הזוכים...</p>

            {winningTeamId && (
              <div className={`mt-6 p-4 rounded-xl ${
                winningTeamId === myTeam?.id
                  ? 'bg-emerald-500/30 border-2 border-emerald-400'
                  : winningTeamId === 'tie'
                    ? 'bg-amber-500/30 border-2 border-amber-400'
                    : 'bg-white/10'
              }`}>
                <p className="font-bold text-lg">
                  {winningTeamId === myTeam?.id
                    ? '🎉 הצוות שלכם ניצח!'
                    : winningTeamId === 'tie'
                      ? '🤝 תיקו!'
                      : '😅 בפעם הבאה!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stage6TeamChallenge;
