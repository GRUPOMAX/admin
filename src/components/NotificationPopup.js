import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { CSSTransition } from 'react-transition-group';
import './NotificationPopup.css'; // Para animação

const NotificationPopup = ({ title, message, isVisible, onClose, command }) => {
  const [showPopup, setShowPopup] = useState(isVisible);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // Evento de clique para detectar a primeira interação do usuário
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (isVisible && userInteracted) {
      const audio = new Audio('/sound-notification.mp3');
      audio.play().catch((error) => console.log('Erro ao reproduzir o som:', error));
      
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [isVisible, userInteracted]);

  // O comando só será executado quando o usuário clicar em "Entendido"
  const handleOk = () => {
    if (command) {
      console.log('Executando comando:', command);  // Verifique qual comando está sendo passado
      executeCommand(command);
    }
    onClose();  // Fecha o modal após executar o comando
  };

  const executeCommand = (command) => {
    switch (command) {
      case 'reload':
        window.location.reload();
        break;
      case 'clearCache':
        window.location.href = window.location.href + "?cache=" + new Date().getTime();
        break;
      case 'logOut':
        console.log('Deslogando o usuário');
        // Chame a função de logout aqui, se necessário
        break;
      default:
        console.log('Comando não reconhecido:', command);
    }
  };

  return (
    <CSSTransition
      in={showPopup}
      timeout={300} // Tempo da animação em ms
      classNames="popup"
      unmountOnExit
    >
      <Modal
        title={title}
        visible={showPopup}
        onOk={handleOk}  // O comando será executado ao clicar em "Entendido"
        onCancel={onClose}
        okText="Entendido"
        cancelText="Fechar"
      >
        <p>{message}</p>
      </Modal>
    </CSSTransition>
  );
};

export default NotificationPopup;
