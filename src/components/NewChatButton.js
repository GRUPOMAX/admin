import React from 'react';
import { startNewChat } from '../firebaseChat';

const NewChatButton = ({ userId, userName, setChatId }) => {
  const handleStartNewChat = async (targetUserId) => {
    try {
      console.log(`Iniciando nova conversa entre ${userId} e ${targetUserId}`);
      const chatId = await startNewChat(userId, targetUserId);
      setChatId(chatId);
    } catch (error) {
      console.error('Erro ao iniciar nova conversa:', error);
    }
  };

  return (
    <button onClick={() => handleStartNewChat(userId)}>
      Iniciar Nova Conversa
    </button>
  );
};

export default NewChatButton;
