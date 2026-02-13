import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-[SourceSans] text-sm tracking-[0.12em] transition-all rounded-xl';

  const variants = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
    secondary: 'border border-white/80 bg-white/85 text-neutral-800 hover:bg-white',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizes = {
    small: 'px-6 py-2',
    medium: 'px-8 py-3',
    large: 'px-10 py-4'
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`} disabled={disabled} {...props} >
      {children}
    </button>
  );
};

export default Button;
