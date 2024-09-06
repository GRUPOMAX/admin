import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

const NotificationSystem = ({ notificacoes, setNotificacoes, userId }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  // Função para filtrar e mostrar notificações não lidas para o usuário logado
  const mostrarNotificacaoNaoLida = () => {
    console.log("Verificando notificações para o usuário:", userId);
    console.log("Notificações disponíveis:", notificacoes);

    // Filtra notificações não lidas para o usuário atual
    const naoLidas = notificacoes.find(
      (notificacao) => !notificacao.lido && notificacao.userId === userId
    );
    
    if (naoLidas) {
      console.log("Notificação encontrada para exibir:", naoLidas);
      setCurrentNotification(naoLidas); // Define a notificação atual
      setPopupVisible(true);  // Exibe o popup
    } else {
      console.log("Nenhuma notificação não lida encontrada para o usuário atual.");
    }
  };

  // Marca a notificação como lida e fecha o popup
  const marcarComoLido = (id) => {
    const updatedNotificacoes = notificacoes.map((notificacao) =>
      notificacao.id === id ? { ...notificacao, lido: true } : notificacao
    );
    setNotificacoes(updatedNotificacoes);
    setPopupVisible(false);
  };

  useEffect(() => {
    // Sempre que as notificações ou userId mudarem, verificar se há notificações não lidas
    mostrarNotificacaoNaoLida();
  }, [notificacoes, userId]);  // Executa quando `notificacoes` ou `userId` mudarem

  return (
    <Modal
      title="Nova Notificação"
      visible={popupVisible}
      onOk={() => marcarComoLido(currentNotification?.id)}
      onCancel={() => marcarComoLido(currentNotification?.id)}
    >
      <p>{currentNotification?.mensagem}</p>
    </Modal>
  );
};

export default NotificationSystem;
