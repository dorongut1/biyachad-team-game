import React, { useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { GameStage, ViewMode } from './types';

// Shared components
import QuoteCard from './components/shared/QuoteCard';
import Timer from './components/shared/Timer';
import ParticipantCard from './components/shared/ParticipantCard';
import TeamScoreBoard from './components/shared/TeamScoreBoard';

// Stage components
import Stage0Welcome from './components/stages/Stage0Welcome';
import Stage1IceBreaker from './components/stages/Stage1IceBreaker';
import Stage2WhoKnows from './components/stages/Stage2WhoKnows';
import Stage3TeamAssignment from './components/stages/Stage3TeamAssignment';
import Stage4TeamBattle from './components/stages/Stage4TeamBattle';
import Stage5TwoTruths from './components/stages/Stage5TwoTruths';
import Stage6TeamChallenge from './components/stages/Stage6TeamChallenge';
import Stage7Gift from './components/stages/Stage7Gift';
import Stage8Reflection from './components/stages/Stage8Reflection';
import Stage9Finale from './components/stages/Stage9Finale';

// Constants
import { QUOTES } from './constants';

function App() {
  const {
    state,
    currentUser,
    viewMode,
    addParticipant,
    setCompanyName,
    addMockParticipants,
    nextStage,
    previousStage,
    goToStage,
    assignTeams,
    addTeamScore,
    submitAnswer,
    sendFeedback,
    resetGame
  } = useGameState();

  // Stage names for navigation
  const stageNames: Record<GameStage, string> = {
    [GameStage.Welcome]: 'ברוכים הבאים',
    [GameStage.IceBreaker]: 'שבירת קרח',
    [GameStage.WhoKnowsWho]: 'מי מכיר את מי',
    [GameStage.TeamAssignment]: 'חלוקה לצוותים',
    [GameStage.TeamBattle]: 'קרב צוותים',
    [GameStage.TwoTruths]: 'שתי אמיתות ושקר',
    [GameStage.TeamChallenge]: 'אתגרי צוות',
    [GameStage.Gift]: 'מתנת מילים',
    [GameStage.Reflection]: 'רפלקציה',
    [GameStage.Finale]: 'סיום'
  };

  // Render current stage
  const renderStage = () => {
    const commonProps = {
      state,
      viewMode,
      currentUser,
      onNext: nextStage
    };

    switch (state.currentStage) {
      case GameStage.Welcome:
        return (
          <Stage0Welcome
            {...commonProps}
            onJoin={(name, emoji, bio) => addParticipant(name, emoji, bio)}
            onStart={nextStage}
            onSetCompanyName={setCompanyName}
            onAddMockParticipants={addMockParticipants}
          />
        );

      case GameStage.IceBreaker:
        return (
          <Stage1IceBreaker
            {...commonProps}
            onAnswer={(questionId, answer) => submitAnswer(questionId, answer)}
          />
        );

      case GameStage.WhoKnowsWho:
        return (
          <Stage2WhoKnows
            {...commonProps}
            onVote={(participantId) => console.log('Voted for:', participantId)}
          />
        );

      case GameStage.TeamAssignment:
        return (
          <Stage3TeamAssignment
            {...commonProps}
            onAssignTeams={assignTeams}
          />
        );

      case GameStage.TeamBattle:
        return (
          <Stage4TeamBattle
            {...commonProps}
            onAddTeamScore={addTeamScore}
          />
        );

      case GameStage.TwoTruths:
        return (
          <Stage5TwoTruths
            {...commonProps}
            onAddTeamScore={addTeamScore}
          />
        );

      case GameStage.TeamChallenge:
        return (
          <Stage6TeamChallenge
            {...commonProps}
            onAddTeamScore={addTeamScore}
          />
        );

      case GameStage.Gift:
        return (
          <Stage7Gift
            {...commonProps}
            onSendFeedback={sendFeedback}
          />
        );

      case GameStage.Reflection:
        return <Stage8Reflection {...commonProps} />;

      case GameStage.Finale:
        return (
          <Stage9Finale
            {...commonProps}
            onRestart={resetGame}
          />
        );

      default:
        return <div>Unknown stage</div>;
    }
  };

  // Navigation footer (for host only, not on welcome/finale)
  const showNavigation = viewMode === 'host' &&
    state.currentStage !== GameStage.Welcome &&
    state.currentStage !== GameStage.Finale;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900" dir="rtl">
      {/* Main content */}
      <main className="relative">
        {renderStage()}
      </main>

      {/* Navigation footer for host */}
      {showNavigation && (
        <footer className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10 px-4 py-3 z-40">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Previous button */}
            <button
              onClick={previousStage}
              disabled={state.currentStage === GameStage.Welcome}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <span>←</span>
              <span className="hidden sm:inline">הקודם</span>
            </button>

            {/* Stage indicator */}
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm hidden sm:inline">שלב</span>
              <div className="flex gap-1">
                {Object.values(GameStage)
                  .filter((v) => typeof v === 'number')
                  .map((stage) => (
                    <button
                      key={stage}
                      onClick={() => goToStage(stage as GameStage)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        stage === state.currentStage
                          ? 'bg-secondary scale-125'
                          : stage < state.currentStage
                            ? 'bg-emerald-500 hover:bg-emerald-400'
                            : 'bg-white/20 hover:bg-white/40'
                      }`}
                      title={stageNames[stage as GameStage]}
                    />
                  ))}
              </div>
              <span className="text-white/60 text-sm">
                {state.currentStage + 1}/10
              </span>
            </div>

            {/* Next button */}
            <button
              onClick={nextStage}
              disabled={state.currentStage === GameStage.Finale}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <span className="hidden sm:inline">הבא</span>
              <span>→</span>
            </button>
          </div>
        </footer>
      )}

      {/* Host mode indicator */}
      {viewMode === 'host' && (
        <div className="fixed top-4 left-4 glass px-3 py-1 rounded-full text-sm z-50">
          <span className="text-amber-400">👑</span>
          <span className="text-white/60 mr-1">מארח</span>
        </div>
      )}

      {/* Participant mode indicator with team */}
      {viewMode === 'participant' && currentUser && (
        <div className="fixed top-4 left-4 glass px-3 py-1 rounded-full text-sm z-50 flex items-center gap-2">
          <span>{currentUser.emoji}</span>
          <span className="text-white/80">{currentUser.name}</span>
          {currentUser.teamId && state.teams.length > 0 && (
            <span className={`px-2 py-0.5 rounded ${
              state.teams.find(t => t.id === currentUser.teamId)?.bgColor || 'bg-white/20'
            }`}>
              {state.teams.find(t => t.id === currentUser.teamId)?.name}
            </span>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-confetti {
          animation: confetti 3s linear forwards;
        }

        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .glass-dark {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .input-glass {
          width: 100%;
          padding: 1rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          outline: none;
          transition: all 0.2s;
        }

        .input-glass:focus {
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.3);
        }

        .input-glass::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: bold;
          padding: 0.75rem 2rem;
          border-radius: 1rem;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-ghost {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 1rem;
          transition: all 0.2s;
        }

        .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

export default App;
