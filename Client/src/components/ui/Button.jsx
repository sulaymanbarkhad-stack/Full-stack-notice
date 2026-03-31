import React from 'react';

export const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 outline-none gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90 active:scale-[0.98]',
    outline: 'bg-transparent border border-border text-text-primary hover:bg-bg active:scale-[0.98]',
    danger: 'bg-error text-white hover:opacity-90 active:scale-[0.98]',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg active:scale-[0.98]',
  };

  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

