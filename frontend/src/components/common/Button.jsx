import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-["Monsterat"] text-sm transition-all';

  const variants = {
    primary: 'bg-[#22df04] text-black hover:bg-[#1fc704] rounded-sm',
    secondary: 'border border-neutral-300 hover:scale-105 rounded-sm',
    danger: 'bg-red-500 text-white hover:bg-red-600 rounded-sm'
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