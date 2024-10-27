// Text.jsx
import React from 'react';

const Text = ({ size = 'medium', color = 'primaryText', className='', children }) => {
  // Base color styles
  const colorStyles = {
    primaryText: 'text-primaryText',
    secondaryText: 'text-secondaryText',
    mutedText: 'text-mutedText',
  };

  // Size-based styles
  const sizeStyles = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <p className={`${colorStyles[color]} ${sizeStyles[size]} ${className} font-mono`}>
      {children}
    </p>
  );
};

export default Text;
