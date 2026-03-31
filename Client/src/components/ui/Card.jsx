import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-surface rounded-lg border border-border shadow-sm p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

