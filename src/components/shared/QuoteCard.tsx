import React from 'react';
import { Quote } from '../../types';

interface QuoteCardProps {
  quote: Quote;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  className = '', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'p-4 text-lg',
    medium: 'p-6 text-xl md:text-2xl',
    large: 'p-8 text-2xl md:text-3xl'
  };

  return (
    <div className={`glass-card rounded-2xl border-r-4 border-amber-500 text-right ${sizeClasses[size]} ${className}`}>
      <p className="font-bold text-amber-200 leading-relaxed mb-3">
        "{quote.text}"
      </p>
      <p className="text-sm text-amber-300/70">— {quote.source}</p>
    </div>
  );
};

export default QuoteCard;
