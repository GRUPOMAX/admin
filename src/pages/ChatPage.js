import React, { useState, useEffect, useRef } from 'react';
import { List, Avatar, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './styles/ChatPage.css';
import io from 'socket.io-client';

const socket = io('http://92.113.32.246:4000');

const ChatPage = ({ userProfile }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [receiverUsername, setReceiverUsername] = useState(null);

  const username = userProfile.username; // Username of the logged-in user

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to the latest message when the messages array is updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch online users and filter out the logged-in user
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch('http://92.113.32.246:4000/users');
        const users = await response.json();
        const filteredUsers = users.filter(user => user.username !== username);
        setOnlineUsers(filteredUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários online:', error);
      }
    };

    fetchOnlineUsers();
  }, [username]);

  // Fetch messages for the active chat
  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`http://92.113.32.246:4000/chats/${chatId}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  // Open a chat with a user
  const openChat = (user) => {
    const chatId = [username, user.username].sort().join('_');
    setActiveChatId(chatId);
    setReceiverUsername(user.username);
    fetchMessages(chatId);
    socket.emit('join_chat', chatId);
  };

  // Listen for new messages
  useEffect(() => {
    socket.on('receive_message', (message) => {
      if (message.chat_id === activeChatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [activeChatId]);

  // Send a new message
  const handleSendMessage = () => {
    if (newMessage.trim() && activeChatId && receiverUsername) {
      const messageData = {
        chat_id: activeChatId,
        sender_username: username,
        receiver_username: receiverUsername,
        text: newMessage,
      };

      socket.emit('send_message', messageData);
      setNewMessage(''); // Clear input
    }
  };

  return (
    <div className="chat-page">
      <div className="online-users">
        <h2>Usuários Online</h2>
        <List
          itemLayout="horizontal"
          dataSource={onlineUsers}
          renderItem={(user) => (
            <List.Item onClick={() => openChat(user)}>
              <List.Item.Meta
                avatar={<Avatar src={user.profilePicUrl || <UserOutlined />} />}
                title={user.username}
                description={user.Cargo1}
              />
            </List.Item>
          )}
        />
      </div>

      <div className="chat-window">
      <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender_username === username ? 'sent' : 'received'}`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="send-message-form">
          <Input
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onPressEnter={handleSendMessage}
          />
          <Button type="primary" onClick={handleSendMessage}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
