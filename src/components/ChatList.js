import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { List, Typography, Card, Badge, Select, Button } from 'antd';
import './ChatList.css'; // Arquivo CSS para classes personalizadas

const { Text } = Typography;
const { Option } = Select;

const ChatList = ({ userId, selectChat, setChatUserName }) => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');

  // Buscar todos os usuários no Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        const usersList = querySnapshot.docs.map(doc => ({
          id: parseInt(doc.id, 10),  // Converte o ID para número
          ...doc.data(),
        }));
        // Filtra para remover o usuário atual da lista e para garantir que apenas usuários com nomes apareçam
        const filteredUsers = usersList.filter(user => user.id !== userId && user.name && user.name.trim() !== '');
        setUsers(filteredUsers);
        setOnlineUsers(filteredUsers.filter(user => user.isOnline)); // Filtra apenas os usuários online
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, [userId]);

  const startChatWithUser = async () => {
    if (!selectedUser) {
      return;
    }
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', userId)
      );
      const querySnapshot = await getDocs(q);

      let chatId = null;

      // Verificar se já existe uma conversa com esse usuário
      for (const docSnapshot of querySnapshot.docs) {
        const chatData = docSnapshot.data();
        if (chatData.participants.includes(selectedUser)) {
          chatId = docSnapshot.id;
          break;
        }
      }

      // Se não existir uma conversa, crie uma nova
      if (!chatId) {
        const newChatRef = await addDoc(chatsRef, {
          participants: [userId, selectedUser],  // Garante que IDs sejam números
          createdAt: new Date(),
          messages: [],
        });
        chatId = newChatRef.id;
      }

      setChatUserName(selectedUserName);  // Define o nome do usuário selecionado
      selectChat(chatId); // Seleciona a conversa
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
    }
  };

  return (
    <Card className="chat-list-card" title="Suas Conversas">
      <Select
        style={{ width: '100%', marginBottom: '10px' }}
        placeholder="Selecione um usuário online"
        onChange={(value, option) => {
          setSelectedUser(value);
          setSelectedUserName(option.children);
        }}
      >
        {onlineUsers.map(user => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </Select>
      <Button
        type="primary"
        block
        onClick={startChatWithUser}
        disabled={!selectedUser}
      >
        Iniciar Conversa
      </Button>

      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={user => (
          <List.Item
            onClick={() => startChatWithUser(user.id)}
            className="chat-list-item"
          >
            <List.Item.Meta
              title={
                <Text strong>
                  {user.name}{' '}
                  <Badge
                    status={user.isOnline ? 'success' : 'error'}
                    text={user.isOnline ? 'Online' : ''}
                  />
                </Text>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: "Nenhum usuário encontrado." }}
      />
    </Card>
  );
};

export default ChatList;
