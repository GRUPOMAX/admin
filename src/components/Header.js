import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Menu, Badge, Button, message } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined, UserAddOutlined, SettingOutlined, BellOutlined, AppstoreOutlined, SwapOutlined, SendOutlined, LaptopOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, onSnapshot } from "firebase/firestore";
import axios from 'axios';
import uploadCompaniesToFirebase from '../uploadCompaniesToFirebase';
import './Header.css';

const Header = ({ userProfile, onLogout }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  // Função para formatar a chave da empresa para uso na URL
  const formatKey = (key) => {
    return key
      .toLowerCase()  // Converter para minúsculas
      .replace(/\s+/g, '-')  // Substituir espaços por hífens
      .replace(/[^a-z0-9-]/g, '');  // Remover caracteres não alfanuméricos e hífens
  };

  const fetchEmpresas = () => {
    if (!userProfile || !userProfile.id) {
      console.error('UserID não está disponível.');
      setErro("UserID não está disponível.");
      setCarregando(false);
      return;
    }

    console.log("Iniciando a busca de empresas no Firebase para o usuário:", userProfile.id);

    const docRef = doc(db, "users", String(userProfile.id));

    // Escuta em tempo real para mudanças no documento do Firebase
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const dados = docSnap.data();
        console.log("Dados recuperados do documento Firebase:", dados);

        if (dados.companies && dados.companies.length > 0) {
          console.log("Empresas encontradas:", dados.companies);
          setEmpresas(dados.companies);

          // Define a empresa inicial como a primeira do array e redireciona
          const primeiraEmpresa = dados.companies[0];
          setSelectedEmpresa(primeiraEmpresa);
          navigate(`/home/${formatKey(primeiraEmpresa)}`);
        } else {
          console.log("Nenhuma empresa encontrada no documento.");
          setEmpresas([]);
        }
      } else {
        console.error('Nenhum documento encontrado para esse usuário.');
        setErro('Nenhum documento encontrado para esse usuário.');
      }
      setCarregando(false);
    }, (error) => {
      console.error('Erro ao buscar dados do Firebase:', error);
      setErro('Erro ao buscar dados do Firebase');
      setCarregando(false);
    });

    // Limpeza da escuta quando o componente é desmontado
    return () => {
      console.log("Limpeza da escuta do Firebase.");
      unsubscribe();
    };
  };

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

    fetchNotifications();
    const unsubscribeEmpresas = fetchEmpresas(); // Chama a função para buscar as empresas

    // Chama a função para atualizar as empresas no Firebase
    if (userProfile && userProfile.empresa) {
      console.log("Chamando uploadCompaniesToFirebase");
      uploadCompaniesToFirebase(userProfile)
        .then(() => console.log("Dados enviados para o Firebase"))
        .catch(error => console.error("Erro ao enviar dados para o Firebase:", error));
    }

    // Limpeza da escuta quando o componente é desmontado
    return () => {
      if (unsubscribeEmpresas) unsubscribeEmpresas();
    };
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
    switch (key) {
      case 'editProfile':
        navigate('/home/editar-perfil');
        break;
      case 'createUser':
        navigate('/home/criar-usuario');
        break;
      case 'sendNotification':
        navigate('/home/send-notification');
        break;
      case 'config':
        navigate('/home/config');
        break;
      case 'manageShortcuts':
        navigate('/home/gerenciar-atalhos');
        break;
      case 'usuariosOnline':
        navigate('/home/usuarios-online');
        break;
      case 'notas':
        navigate('/home/notas');
        break;
      case 'tarefas':
        navigate('/home/tarefas');
        break;
      case 'monitorVPS':
        navigate('/home/monitor-vps');
        break;
      case 'galeria':
        navigate('/home/galeria');
        break;
      case 'logout':
        onLogout();
        break;
      default:
        // Formatar e navegar para caminhos dinâmicos
        navigate(`/home/${formatKey(key)}`);
        break;
    }
  };
  
  const empresasMenu = (
    <Menu onClick={handleMenuClick}>
      {carregando ? (
        <Menu.Item disabled>Carregando empresas...</Menu.Item>
      ) : (
        empresas.length > 0 ? (
          empresas.map((empresa) => (
            <Menu.Item key={empresa}>
              {empresa}
            </Menu.Item>
          ))
        ) : (
          <Menu.Item disabled>
            Nenhuma empresa disponível
          </Menu.Item>
        )
      )}
    </Menu>
  );

  const deleteNotification = async (notification) => {
    try {
      await axios.delete(
        'https://nocodb.nexusnerds.com.br/api/v2/tables/myd2oats63ype1t/records',
        {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
          data: { Id: notification.Id },
        }
      );

      setNotifications(prevNotifications =>
        prevNotifications.filter(n => n.Id !== notification.Id)
      );

      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
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
        <>
          <Menu.Item key="createUser" icon={<UserAddOutlined />}>
            Criar Usuário
          </Menu.Item>
          <Menu.Item key="sendNotification" icon={<SendOutlined />}>
            Enviar Notificação
          </Menu.Item>
          <Menu.Item key="usuariosOnline" icon={<UserOutlined />}>
            Usuários Online
          </Menu.Item>
        </>
      )}
      {userProfile.Cargo1 === 'Desenvolvedor' && (
        <>
          <Menu.Item key="config" icon={<SettingOutlined />}>
            Configurações
          </Menu.Item>
          <Menu.Item key="monitorVPS" icon={<LaptopOutlined />}>
            Monitor VPS
          </Menu.Item>
          <Menu.Item key="galeria" icon={<AppstoreOutlined />}>
            Galeria
          </Menu.Item>
        </>
      )}
      <Menu.Item key="notas" icon={<FileTextOutlined />}>
        Notas
      </Menu.Item>
      <Menu.Item key="tarefas" icon={<CheckCircleOutlined />}>
        Tarefas
      </Menu.Item>
      <Menu.Item key="manageShortcuts" icon={<AppstoreOutlined />}>
        Atalhos Pessoais
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
            {selectedEmpresa ? (
              <span>{selectedEmpresa}</span>
            ) : (
              <SwapOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
            )}
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
