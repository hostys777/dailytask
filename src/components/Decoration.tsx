import React from 'react';

type DecorationProps = {
  type: 'blob' | 'squiggly' | 'confetti' | 'circle' | 'triangle' | 'star';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

export const Decoration: React.FC<DecorationProps> = ({ type, color = 'var(--color-tertiary)', className = '', style }) => {
  if (type === 'circle') {
    return (
      <div 
        className={`absolute rounded-full z-0 ${className}`} 
        style={{ backgroundColor: color, ...style }} 
        aria-hidden="true" 
      />
    );
  }

  if (type === 'triangle') {
    return (
      <svg
        className={`absolute z-0 ${className}`}
        style={{ fill: color, ...style }}
        width="40" height="40" viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2L22 20H2L12 2Z" />
      </svg>
    );
  }

  if (type === 'star') {
    return (
      <svg
        className={`absolute z-0 ${className}`}
        style={{ fill: color, ...style }}
        width="40" height="40" viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
      </svg>
    );
  }
  
  if (type === 'blob') {
    return (
       <div 
        className={`absolute rounded-blob z-0 ${className}`} 
        style={{ backgroundColor: color, ...style }} 
        aria-hidden="true" 
      />
    );
  }

  if (type === 'squiggly') {
    return (
      <svg 
        className={`absolute z-0 ${className}`} 
        width="100%" 
        height="10" 
        style={style}
        aria-hidden="true"
      >
        <path d="M0,5 Q10,0 20,5 T40,5 T60,5 T80,5 T100,5" 
              fill="none" 
              stroke={color} 
              strokeWidth="4" 
              strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'confetti') {
    return (
      <div className={`absolute z-0 flex gap-4 ${className}`} style={style} aria-hidden="true">
         <Decoration type="circle" color="var(--color-secondary)" className="w-4 h-4 static" />
         <Decoration type="triangle" color="var(--color-tertiary)" className="w-5 h-5 static -rotate-12" />
         <Decoration type="circle" color="var(--color-quaternary)" className="w-3 h-3 static mt-4" />
      </div>
    );
  }

  return null;
};
