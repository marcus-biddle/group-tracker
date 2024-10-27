// Button.jsx
import React from 'react';

const Button = ({ size = 'medium', disabled = false, children, onClick }) => {
  // Base styles
  const baseStyles = ` rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryHover transition duration-300 ease-in-out ${
    disabled ? 'bg-disabledButtonBg cursor-not-allowed' : 'text-textPrimaryButton bg-primary hover:bg-primaryHover cursor-pointer'
  }`;

  // Size-based styles
  const sizeStyles = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-md',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
