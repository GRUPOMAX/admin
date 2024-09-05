import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Avatar, Button, Input } from 'antd';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';
import './MiniChat.css';

const MiniChat = ({ chatId, loggedInUserId, loggedInUsername, loggedInProfilePicUrl }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);

      if (msgs.length > 0 && !isOpen) {
        setIsOpen(true);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        senderId: loggedInUserId,
        text: newMessage,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`mini-chat ${isOpen ? 'open' : ''}`}>
      <div className="mini-chat-header">
        <Avatar src={loggedInProfilePicUrl} />
        <span>{loggedInUsername}</span>
        <Button type="text" icon={<CloseOutlined />} onClick={toggleChat} />
      </div>
      {isOpen && (
        <div className="mini-chat-body">
          <div className="messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.senderId === loggedInUserId ? 'sent' : 'received'}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="mini-chat-footer">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              onPressEnter={handleSendMessage}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniChat;
