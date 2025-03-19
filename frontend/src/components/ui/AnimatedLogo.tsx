
import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Initial animation
    setIsAnimating(true);
    
    // Animation interval
    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => setIsAnimating(true), 100);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("relative font-sans font-bold inline-flex", className)}>
      <div className="flex relative">
        <span className={cn(
          "text-primary transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-70"
        )}>
          What
        </span>
        <span className={cn(
          "text-primary transition-opacity duration-300 delay-200",
          isAnimating ? "opacity-100" : "opacity-70"
        )}>
          The
        </span>
        <span className={cn(
          "text-primary transition-opacity duration-300 delay-400",
          isAnimating ? "opacity-100" : "opacity-70"
        )}>
          Note
        </span>
      </div>
    </div>
  );
};

export default AnimatedLogo;
