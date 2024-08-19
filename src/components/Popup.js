// src/components/Popup.js
import React from 'react';
import './Popup.css';

const Popup = ({ text, closePopup }) => {
  return (
    <div className="popup">
      <div className="popup-content" dangerouslySetInnerHTML={{ __html: text }} />
      <button onClick={closePopup}>Fechar</button>
    </div>
  );
};

export default Popup;
