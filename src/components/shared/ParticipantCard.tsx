import React from 'react';
import { Participant, Team } from '../../types';

interface ParticipantCardProps {
  participant: Participant;
  team?: Team;
  onClick?: () => void;
  selected?: boolean;
  showScore?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  team,
  onClick,
  selected = false,
  showScore = false,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'p-2 text-sm',
    medium: 'p-4',
    large: 'p-6 text-lg'
  };

  const emojiSizes = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl'
  };

  return (
    <div
      onClick={onClick}
      className={`
        glass-card rounded-2xl ${sizeClasses[size]} flex flex-col items-center gap-2 transition-all
        ${onClick ? 'cursor-pointer hover:scale-105 hover:bg-white/15' : ''}
        ${selected ? 'ring-2 ring-secondary bg-secondary/20 scale-105' : ''}
        ${team ? `border-b-4 ${team.bgColor.replace('bg-', 'border-')}` : ''}
      `}
    >
      <span className={`${emojiSizes[size]} animate-float`} style={{ animationDelay: `${Math.random() * 2}s` }}>
        {participant.emoji}
      </span>
      <span className="font-bold text-white">{participant.name}</span>
      
      {team && (
        <span className={`text-xs ${team.color} font-medium`}>
          {team.name}
        </span>
      )}
      
      {showScore && participant.score > 0 && (
        <span className="text-emerald-400 font-bold text-sm">
          {participant.score} נק'
        </span>
      )}
      
      {participant.bio && size !== 'small' && (
        <span className="text-xs text-white/60 text-center">{participant.bio}</span>
      )}
    </div>
  );
};

export default ParticipantCard;
