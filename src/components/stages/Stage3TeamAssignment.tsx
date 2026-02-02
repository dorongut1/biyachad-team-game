import React, { useState, useEffect } from 'react';
import { GameState, Participant, ViewMode } from '../../types';
import { QUOTES } from '../../constants';
import QuoteCard from '../shared/QuoteCard';

interface Props {
  state: GameState;
  viewMode: ViewMode;
  currentUser: Participant | null;
  onNext: () => void;
  onAssignTeams: () => void;
}

export const Stage3TeamAssignment: React.FC<Props> = ({
  state,
  viewMode,
  currentUser,
  onNext,
  onAssignTeams
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTeams, setShowTeams] = useState(false);

  const handleAssign = () => {
    setIsAnimating(true);
    
    // Shuffle animation
    setTimeout(() => {
      onAssignTeams();
      setIsAnimating(false);
      setShowTeams(true);
    }, 2000);
  };

  // Group participants by team
  const teamGroups = state.teams.map(team => ({
    ...team,
    members: state.participants.filter(p => p.teamId === team.id)
  }));

  const hasTeams = state.participants.some(p => p.teamId);

  useEffect(() => {
    if (hasTeams) {
      setShowTeams(true);
    }
  }, [hasTeams]);

  // HOST VIEW
  if (viewMode === 'host') {
    return (
      <div className="flex flex-col items-center min-h-screen p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">👥 חלוקה לצוותים</h1>
          <QuoteCard quote={QUOTES[3]} size="small" className="max-w-xl" />
        </div>

        {isAnimating && (
          <div className="flex flex-col items-center mb-12 animate-pulse">
            <div className="text-8xl mb-4 animate-bounce">🎰</div>
            <p className="text-2xl font-bold">מערבבים את הקלפים...</p>
            <div className="flex gap-4 mt-6">
              {state.participants.map((p, i) => (
                <span 
                  key={p.id} 
                  className="text-4xl animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {p.emoji}
                </span>
              ))}
            </div>
          </div>
        )}

        {showTeams && !isAnimating && (
          <div className="w-full max-w-5xl animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {teamGroups.filter(t => t.members.length > 0).map((team, i) => (
                <div 
                  key={team.id}
                  className={`glass-card p-6 rounded-3xl animate-scaleIn border-t-4 ${team.bgColor.replace('bg-', 'border-')}`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <h3 className={`text-2xl font-black mb-4 ${team.color}`}>
                    {team.name}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {team.members.map((member, j) => (
                      <div 
                        key={member.id}
                        className="flex flex-col items-center animate-float"
                        style={{ animationDelay: `${j * 0.2}s` }}
                      >
                        <span className="text-4xl mb-1">{member.emoji}</span>
                        <span className="text-sm font-medium">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={onNext} className="btn-success text-xl">
                להתחיל בקרב! ⚔️
              </button>
            </div>
          </div>
        )}

        {!showTeams && !isAnimating && (
          <div className="text-center">
            <div className="glass-card p-12 rounded-3xl mb-8">
              <div className="text-8xl mb-6">🎲</div>
              <h2 className="text-2xl font-bold mb-4">מוכנים להתחלק לצוותים?</h2>
              <p className="text-white/60 mb-8">המערכת תחלק אתכם באקראי לצוותים</p>
              
              <button onClick={handleAssign} className="btn-primary text-xl">
                חלק לצוותים! 🎯
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // PARTICIPANT VIEW
  const myTeam = state.teams.find(t => t.id === currentUser?.teamId);
  const myTeamMembers = state.participants.filter(p => p.teamId === currentUser?.teamId);

  if (!myTeam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fadeIn">
        <div className="text-8xl mb-6 animate-bounce">🎰</div>
        <h2 className="text-2xl font-bold mb-4">ממתינים לחלוקה לצוותים...</h2>
        <p className="text-white/60">המארח יחלק אתכם לצוותים בקרוב</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fadeIn">
      <div className={`glass-card p-8 rounded-3xl w-full max-w-md text-center border-t-4 ${myTeam.bgColor.replace('bg-', 'border-')}`}>
        <div className="text-6xl mb-4">🎉</div>
        <h2 className={`text-3xl font-black mb-6 ${myTeam.color}`}>
          {myTeam.name}
        </h2>
        
        <p className="text-white/80 mb-6">חברי הצוות שלך:</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {myTeamMembers.map(member => (
            <div 
              key={member.id}
              className={`flex flex-col items-center p-3 rounded-xl ${
                member.id === currentUser?.id ? 'bg-white/20 ring-2 ring-white' : ''
              }`}
            >
              <span className="text-3xl mb-1">{member.emoji}</span>
              <span className="text-sm font-medium">
                {member.name}
                {member.id === currentUser?.id && ' (אני)'}
              </span>
            </div>
          ))}
        </div>

        <p className="text-white/60 mt-8 text-sm">
          התכוננו לקרב הצוותים!
        </p>
      </div>
    </div>
  );
};

export default Stage3TeamAssignment;
