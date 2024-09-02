import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore"; 
import { Avatar, Dropdown, Menu, Badge } from 'antd';
import { UserOutlined, LogoutOutlined, BellOutlined, SwapOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import axios from 'axios';
import './Header.css';

const Header = ({ userProfile, onLogout }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userProfile) {
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

    const fetchEmpresas = async () => {
      if (!userProfile || !userProfile.id) {
        console.error('UserID não está disponível.');
        setErro("UserID não está disponível.");
        setCarregando(false);
        return;
      }

      try {
        console.log("Iniciando a busca de empresas no Firebase para o usuário:", userProfile.id);

        // Recupere as empresas do Firebase
        const docRef = doc(db, "users", String(userProfile.id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dados = docSnap.data();
          console.log("Dados recuperados do documento Firebase:", dados);

          if (dados.companies) {
            console.log("Empresas encontradas:", dados.companies);
            setEmpresas(dados.companies);
          } else {
            console.log("Nenhuma empresa encontrada no documento.");
            setEmpresas([]);
          }
        } else {
          console.error('Nenhum documento encontrado para esse usuário.');
          setErro('Nenhum documento encontrado para esse usuário.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do Firebase:', error);
        setErro('Erro ao buscar dados do Firebase');
      } finally {
        setCarregando(false);
      }
    };

    fetchNotifications();
    fetchEmpresas();
  }, [userProfile]);

  const markAsRead = async (notification) => {
    try {
      const updatedNotification = {
        Id: notification.Id,
        title: notification.title,
        userId: notification.userId,
        message: notification.message,
        isRead: true,
        createdAt_: notification.createdAt_,
      };

      const response = await axios.patch(
        'https://nocodb.nexusnerds.com.br/api/v2/tables/myd2oats63ype1t/records',
        updatedNotification,
        {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
        }
      );

      setNotifications(prev =>
        prev.map(n => (n.Id === notification.Id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      onLogout();
    } else {
      navigate(`/home/${key}`);
    }
  };

  const empresasMenu = (
    <Menu onClick={handleMenuClick}>
      {empresas.length > 0 ? (
        empresas.map((empresa, index) => (
          <Menu.Item key={empresa}>
            {empresa}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>
          {carregando ? 'Carregando empresas...' : 'Nenhuma empresa disponível'}
        </Menu.Item>
      )}
    </Menu>
  );

  const notificationMenu = (
    <Menu>
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <Menu.Item key={notification.Id} onClick={() => markAsRead(notification)}>
            {notification.title} - {notification.message}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item>Você não tem notificações.</Menu.Item>
      )}
    </Menu>
  );

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="editProfile" icon={<UserOutlined />}>
        Editar Perfil
      </Menu.Item>
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
        <Dropdown overlay={empresasMenu} placement="bottomRight" trigger={['click']}>
          <div className="switch-icon">
            <SwapOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
          </div>
        </Dropdown>
        <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
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
