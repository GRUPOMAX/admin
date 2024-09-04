import React, { useState, useEffect } from 'react';
import { sendMessage, listenToMessages, startNewChat, getActiveUsers } from '../firebaseChat';
import ChatList from './ChatList';

const Chat = ({ userId, userName }) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [targetUserId, setTargetUserId] = useState('');
  const [targetUserName, setTargetUserName] = useState('');

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const users = await getActiveUsers();
      const filteredUsers = users.filter(user => user.id !== userId);  // Remove o próprio usuário da lista
      console.log('Usuários ativos:', filteredUsers);
      setActiveUsers(filteredUsers);

      if (filteredUsers.length > 0) {
        setTargetUserId(filteredUsers[0].id);
        setTargetUserName(filteredUsers[0].name || filteredUsers[0].username);  // Define o nome do usuário alvo
      }
    };

    fetchActiveUsers();
  }, [userId]);

  useEffect(() => {
    const checkOrCreateChat = async () => {
      if (targetUserId) {
        try {
          console.log(`Verificando ou criando chat entre userId: ${userId} e targetUserId: ${targetUserId}`);
          const chatId = await startNewChat(userId, targetUserId);
          setChatId(chatId);
          console.log(`Chat verificado ou criado com ID: ${chatId}`);
        } catch (error) {
          console.error('Erro ao verificar ou criar conversa:', error);
        }
      }
    };

    checkOrCreateChat();
  }, [targetUserId]);

  useEffect(() => {
    if (!chatId) return;

    console.log(`Escutando mensagens para chatId: ${chatId}`);

    const unsubscribe = listenToMessages(chatId, (msgs) => {
      console.log(`Mensagens recebidas para chatId ${chatId}:`, msgs);
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        console.log(`Enviando mensagem: "${newMessage}" em chatId: ${chatId} por user: ${userName}`);
        await sendMessage(chatId, userId, userName, newMessage.trim());
        setNewMessage('');
      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
      }
    }
  };

  const handleSelectChat = (selectedChatId, selectedUserName) => {
    setChatId(selectedChatId);
    setTargetUserName(selectedUserName);  // Atualiza o nome do usuário alvo
  };

  return (
    <div style={{ display: 'flex', maxWidth: '1000px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <ChatList 
        userId={userId} 
        selectChat={(selectedChatId) => handleSelectChat(selectedChatId, targetUserName)} 
        setTargetUserId={setTargetUserId} 
        setTargetUserName={setTargetUserName} 
      />

      <div style={{ flex: 1, paddingLeft: '20px' }}>
        {chatId ? (
          <>
            <div style={{ marginBottom: '10px' }}>
              <strong>Conversa com:</strong> {targetUserName}
            </div>
            <div id="chat-box" style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll', marginBottom: '10px', borderRadius: '8px' }}>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <strong>{msg.senderId === userId ? 'Você' : msg.senderName}</strong>: {msg.message}
                  </div>
                ))
              ) : (
                <p>Sem mensagens nesta conversa.</p>
              )}
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              style={{ width: 'calc(100% - 90px)', padding: '8px', marginRight: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button onClick={handleSend} style={{ width: '80px', padding: '8px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Enviar
            </button>
          </>
        ) : (
          <p>Selecione uma conversa para começar a chat!</p>
        )}
      </div>
    </div>
  );
};

export default Chat;

