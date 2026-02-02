import React from 'react';
import { Team } from '../../types';

interface TeamScoreBoardProps {
  teams: Team[];
  showRank?: boolean;
}

export const TeamScoreBoard: React.FC<TeamScoreBoardProps> = ({ teams, showRank = true }) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...teams.map(t => t.score), 1);

  return (
    <div className="w-full space-y-4">
      {sortedTeams.map((team, index) => (
        <div 
          key={team.id} 
          className={`glass-card p-4 rounded-2xl flex items-center gap-4 transition-all ${
            index === 0 && showRank ? 'ring-2 ring-yellow-400 bg-yellow-400/10' : ''
          }`}
        >
          {showRank && (
            <span className="text-3xl">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👏'}
            </span>
          )}
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className={`font-bold text-lg ${team.color}`}>{team.name}</span>
              <span className="text-2xl font-black text-white">{team.score}</span>
            </div>
            
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full ${team.bgColor} transition-all duration-1000`}
                style={{ width: `${(team.score / maxScore) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamScoreBoard;
