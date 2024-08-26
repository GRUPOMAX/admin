// src/components/CustomContextMenu.js
import React from 'react';
import './CustomContextMenu.css';

const CustomContextMenu = ({ xPos, yPos, options, isVisible, closeMenu }) => {
  if (!isVisible) return null;

  return (
    <div className="custom-context-menu" style={{ top: `${yPos}px`, left: `${xPos}px` }}>
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={() => {
            option.onClick();
            closeMenu();
          }}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomContextMenu;
