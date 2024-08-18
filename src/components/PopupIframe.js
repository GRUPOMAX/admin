import React, { useState, useEffect, useCallback } from 'react';
import './PopupIframe.css';

const PopupIframe = ({ url, closePopup }) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ top: '20px', left: '20px' });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Use useCallback to memoize handleMouseMove
  const handleMouseMove = useCallback((e) => {
    if (dragging) {
      setPosition({
        top: `${e.clientY - offset.y}px`,
        left: `${e.clientX - offset.x}px`,
      });
    }
  }, [dragging, offset]);

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setDragging(true);
      setOffset({
        x: e.clientX - parseInt(position.left, 10),
        y: e.clientY - parseInt(position.top, 10),
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Include handleMouseMove in the dependency array
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    <div
      className="popup-iframe"
      style={{ top: position.top, left: position.left }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="popup-iframe-header">
        <span className="popup-iframe-close" onClick={closePopup}>&times;</span>
        <div className="popup-iframe-title">Gerador de Proposta</div>
      </div>
      <iframe src={url} width="100%" height="100%" frameBorder="0" title="Popup Iframe" />
    </div>
  );
};

export default PopupIframe;
