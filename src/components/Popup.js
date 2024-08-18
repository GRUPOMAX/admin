import React from 'react';
import './Popup.css';

const Popup = ({ text, closePopup }) => {
  // Função para evitar que o clique no conteúdo do popup feche o popup
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="popup" onClick={closePopup}>
      <div className="popup-content" onClick={handleContentClick}>
        <span className="popup-close" onClick={closePopup}>&times;</span>
        <div className="popup-text" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

export default Popup;
