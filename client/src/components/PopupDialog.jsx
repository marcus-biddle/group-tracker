import React, { useState } from 'react';

const PopupDialog = ({ trigger, content, onHover = false, position = 'top' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => setIsOpen(!isOpen);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const triggerProps = onHover
    ? { onMouseEnter: openDialog, onMouseLeave: closeDialog }
    : { onClick: toggleDialog };

  // Positioning styles based on 'position' prop
  const positionStyles = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2 min-w-[150px]',
    left: 'right-0 mt-2 min-w-[150px]',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block">
      <div {...triggerProps}>{trigger}</div>
      {isOpen && (
        <div className={`absolute ${positionStyles[position]} p-2 bg-[#E53981] text-black font-bold rounded shadow-md z-10`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default PopupDialog;
