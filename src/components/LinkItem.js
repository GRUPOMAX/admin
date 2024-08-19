import React, { useState } from 'react';
import Popup from './Popup';
import PopupIframe from './PopupIframe';
import PopupEquipamentos from './PopupEquipamentos';
import './LinkItem.css';

const LinkItem = ({ url, imgSrc, altText, text, popupText, isIframe, isEquipamentos }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showIframePopup, setShowIframePopup] = useState(false);
  const [showEquipamentosPopup, setShowEquipamentosPopup] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  const handleMouseEnter = () => {
    if (popupText || isEquipamentos) {
      if (hideTimeout) {
        clearTimeout(hideTimeout); // Limpa o timeout se o mouse entrar novamente
      }
      setShowPopup(true);
      if (isEquipamentos) {
        setShowEquipamentosPopup(true);
      }
    }
  };

  const handleMouseLeave = () => {
    if (popupText || isEquipamentos) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
        setShowEquipamentosPopup(false);
      }, 2000); // Tempo em milissegundos para o popup desaparecer após o mouse sair
      setHideTimeout(timeout);
    }
  };

  const handleClick = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do link
    if (isIframe) {
      setShowIframePopup(true); // Exibe o popup do iframe se isIframe for verdadeiro
    } else {
      window.open(url, '_blank', 'noopener noreferrer'); // Abre o link em uma nova guia
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (hideTimeout) {
      clearTimeout(hideTimeout); // Limpa o timeout se o popup for fechado manualmente
    }
  };

  const closeIframePopup = () => {
    setShowIframePopup(false);
  };

  const closeEquipamentosPopup = () => {
    setShowEquipamentosPopup(false);
  };

  return (
    <div className="link-item-container">
      <div
        className="link-item"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a href={url} onClick={handleClick} rel="noopener noreferrer">
          <img src={imgSrc} alt={altText} />
          <p>{text}</p>
        </a>
      </div>
      {showPopup && <Popup text={popupText} closePopup={closePopup} />}
      {showIframePopup && <PopupIframe url={url} closePopup={closeIframePopup} />}
      {showEquipamentosPopup && <PopupEquipamentos closePopup={closeEquipamentosPopup} />}
    </div>
  );
};

export default LinkItem;
