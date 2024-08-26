import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Input, Typography, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import CompanySelector from './CompanySelector';
import './Sidebar.css';

const { Sider } = Layout;
const { Search } = Input;
const { Title } = Typography;

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuOptions = {
    '/home/max-fibra': [
      { name: 'Dashboard', href: '/home/home' },
      { name: 'Consulta CNPJ', href: '/home/max-fibra/consultaCNPJ' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },

    ],
    '/home/vir-telecom': [
      { name: 'Consultar CNPJ', href: '/home/max-fibra/consultaCNPJ' },
    ],
    '/home/reis-services': [
      { name: 'Opção 1 - Reis', href: '/reis-services/opcao1' },
      { name: 'Opção 2 - Reis', href: '/reis-services/opcao2' },
    ],
    '/home/max-fibra/consultaCNPJ': [
      { name: 'Dashboard', href: '/max-fibra/consultaCPF' },
      { name: 'Pagina Inicial', href: '/max-fibra' },
<<<<<<< HEAD
=======
      { name: 'Consulta CPF', href: '/home/max-fibra/consultaCPF' },
>>>>>>> 12857f8 (ajustes de tela de login e reload)
    ],
    '/home/max-fibra/consultaCPF': [
      { name: 'Pagina Inicial', href: '/max-fibra' },
      { name: 'Consulta CNPJ', href: '/max-fibra/consultaCNPJ' },
    ],
    '/home/max-fibra/cadastro':[
    { name: 'Pagina inical', href: '/home' },
    ],
<<<<<<< HEAD
    '/home':[
      { name: 'Max Fibra', href: '/home/max-fibra' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },
      ],
    '/home/editar-perfil':[
      { name: 'Dashboard', href: '/home' },
      { name: 'Max Fibra', href: '/home/max-fibra' },
      ],
    '/home/criar-usuario':[
      { name: 'Dashboard', href: '/home' },
      { name: 'Max Fibra', href: '/home/max-fibra' },
      ],

    '/home/gerenciar-atalhos':[
      { name: 'Dashboard', href: '/home' },
      { name: 'Max Fibra', href: '/home/max-fibra' },
=======
    '/home/home':[
      { name: 'Max Fibra', href: '/home/max-fibra' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },
      ],
      '/home':[
        { name: 'Max Fibra', href: '/home/max-fibra' },
        { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },
>>>>>>> 12857f8 (ajustes de tela de login e reload)
        ],
  };

  const currentPath = location.pathname;
  const options = menuOptions[currentPath] || [];

  const handleLogout = () => {
    // Chama a função de logout passada como prop
    onLogout();
    // Recarrega a página após o logout
    window.location.reload();
  };

  return (
    <Sider className="sidebar" width={250} theme="light">
      <div className="search-bar">
        <Search placeholder="Pesquisa..." enterButton />
      </div>
      <div className="dynamic-menu">
        {options.length > 0 && (
          <>
            <Title level={4}>Menu</Title>
            <Menu mode="inline" selectedKeys={[currentPath]}>
              {options.map((option, index) => (
                <Menu.Item key={option.href}>
                  <Link to={option.href}>{option.name}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </>
        )}
      </div>
      <CompanySelector />

      {/* Botão de Logout */}
      <div className="logout-button">
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          danger
          style={{ marginTop: '20px', width: '100%' }}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
