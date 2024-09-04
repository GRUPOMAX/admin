import React, { useState, useEffect } from 'react';
import { listenToMessages } from '../firebaseChat';

const ChatNotifications = ({ chatId }) => {
  const [newMessages, setNewMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setNewMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', width: '250px', marginRight: '20px' }}>
      <h3>Novas mensagens</h3>
      {newMessages.length > 0 ? (
        newMessages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '10px' }}>
            <strong>{msg.userName}</strong>: {msg.message}
          </div>
        ))
      ) : (
        <p>Sem novas mensagens para este ID</p>
      )}
    </div>
  );
};

export default ChatNotifications;
