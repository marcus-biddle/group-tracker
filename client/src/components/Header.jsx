// Header.jsx
import React from 'react';

const Header = ({ level = 'h1', color = 'primaryText', children }) => {
  const Tag = level; // dynamically set header tag

  // Color styles from Tailwind config
  const colorStyles = {
    primaryText: 'text-primaryText',
    secondaryText: 'text-secondaryText',
    mutedText: 'text-mutedText',
  };

  return (
    <Tag className={`${colorStyles[color]} text-${level} font-semibold capitalize`}>
      {children}
    </Tag>
  );
};

export default Header;
