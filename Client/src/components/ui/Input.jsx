import React from 'react';

export const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-3.5 py-2.5 rounded-md bg-surface text-text-primary outline-none transition-all duration-200 border
          ${error ? 'border-error ring-1 ring-error' : 'border-border focus:border-primary focus:ring-1 focus:ring-primary'} 
          ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

