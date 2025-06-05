
interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const ScoreBadge = ({ score, size = 'md' }: ScoreBadgeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-700 border-red-200';
    if (score >= 60) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm': return 'px-2 py-0.5 text-xs';
      case 'lg': return 'px-4 py-2 text-base font-bold';
      default: return 'px-2 py-1 text-xs font-medium';
    }
  };

  const getFlairText = (score: number) => {
    if (score >= 80) return 'AI Detected';
    if (score >= 60) return 'Suspicious';
    if (score >= 40) return 'Uncertain';
    return 'Human-like';
  };

  return (
    <div className={`
      ${getScoreColor(score)} 
      rounded-full 
      ${getSizeClasses(size)}
      border
      inline-flex items-center
    `}>
      {score}% {getFlairText(score)}
    </div>
  );
};

export default ScoreBadge;
