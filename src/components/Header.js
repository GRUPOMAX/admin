import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Menu, Badge, notification } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined, UserAddOutlined, SettingOutlined, BellOutlined, AppstoreOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import axios from 'axios';
import './Header.css';

const Header = ({ userProfile, onLogout }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'editProfile':
        navigate('/home/editar-perfil');
        break;
      case 'createUser':
        navigate('/home/criar-usuario');
        break;
      case 'config':
        navigate('/home/config');
        break;
      case 'manageShortcuts':
        navigate('/home/gerenciar-atalhos');
        break;
      case 'sendNotification': // Corrigido para a chave correta
        navigate('/home/send-notification');
        break;
      case 'logout':
        onLogout();
        break;
      default:
        break;
    }
  };
  

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userProfile) { // Move a verificação condicional para dentro do useEffect
        try {
          const { data } = await axios.get('https://nocodb.nexusnerds.com.br/api/v2/tables/myd2oats63ype1t/records', {
            params: {
              where: `(userId,eq,${userProfile.id})`,
            },
            headers: {
              'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
            },
          });
          const unreadNotifications = data.list.filter(notification => !notification.isRead);
          setNotifications(data.list);
          setUnreadCount(unreadNotifications.length);
        } catch (error) {
          console.error('Erro ao buscar notificações:', error);
        }
      }
    };

    fetchNotifications();
  }, [userProfile]); // `userProfile` como dependência para garantir que o hook execute ao carregar

  const markAsRead = async (notification) => {
    try {
      console.log("Notification antes de atualizar:", notification);
  
      const updatedNotification = {
        Id: notification.Id,
        title: notification.title,
        userId: notification.userId,
        message: notification.message,
        isRead: true,
        createdAt_: notification.createdAt_,
      };
  
      console.log("Dados enviados na requisição PATCH:", updatedNotification);
  
      const response = await axios.patch(
        'https://nocodb.nexusnerds.com.br/api/v2/tables/myd2oats63ype1t/records', // Remova o ${notificationId} da URL
        updatedNotification, // Envia o objeto completo como corpo da requisição
        {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
        }
      );
  
      console.log("Resposta da API após marcar como lido:", response.data);
  
      // Atualiza o estado local
      setNotifications(prev =>
        prev.map(n => (n.Id === notification.Id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const deleteNotification = async (notification) => {
    try {
      console.log("Deletando notificação com ID:", notification.Id); // Verificação
  
      await axios.delete(
        'https://nocodb.nexusnerds.com.br/api/v2/tables/myd2oats63ype1t/records',
        {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
          data: { Id: notification.Id }, // Envia o ID no corpo da requisição
        }
      );
  
      // Atualiza a lista de notificações localmente
      setNotifications(prevNotifications =>
        prevNotifications.filter(n => n.Id !== notification.Id)
      );
  
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0)); // Evita que o contador fique negativo
  
      message.success('Notificação deletada com sucesso.');
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      message.error('Erro ao deletar a notificação.');
    }
  };
  
  const notificationMenu = (
    <Menu>
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <Menu.Item key={notification.Id} onClick={() => markAsRead(notification)}>
            {notification.title} - {notification.message}
            <Button type="link" onClick={(e) => { e.stopPropagation(); deleteNotification(notification); }}>Deletar</Button>
          </Menu.Item>
        ))
      ) : (
        <Menu.Item>Você não tem notificações.</Menu.Item>
      )}
    </Menu>
  );
  

  
  

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="editProfile" icon={<EditOutlined />}>
        Editar Perfil
      </Menu.Item>
      {(userProfile.Cargo1 === 'Administrador' || userProfile.Cargo1 === 'Desenvolvedor') && (
        <Menu.Item key="createUser" icon={<UserAddOutlined />}>
          Criar Usuário
        </Menu.Item>
      )}
      {(userProfile.Cargo1 === 'Administrador' || userProfile.Cargo1 === 'Desenvolvedor') && (
        <Menu.Item key="sendNotification" icon={<SendOutlined  />}>
          Enviar Notificação
        </Menu.Item>
      )}
      {userProfile.Cargo1 === 'Desenvolvedor' && (
        <>
          <Menu.Item key="config" icon={<SettingOutlined />}>
            Configurações
          </Menu.Item>
          <Menu.Item key="manageShortcuts" icon={<AppstoreOutlined />}>
            Gerenciar Atalhos
          </Menu.Item>
        </>
      )}
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Sair
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <div className="header-left">
        <div className="user-info">
          <span>{userProfile.name}</span>
        </div>
      </div>
      <div className="header-right">
        <Dropdown overlay={notificationMenu} placement="bottomRight" trigger={['click']}>
          <div className="notification-icon">
            <Badge count={unreadCount} className="notification-count">
              <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
            </Badge>
          </div>
        </Dropdown>
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <Avatar
            size={48}
            src={userProfile.profilePic || null}
            icon={!userProfile.profilePic && <UserOutlined />}
            style={{ cursor: 'pointer' }}
          />
        </Dropdown>
        </div>


    </div>
  );
};

export default Header;
