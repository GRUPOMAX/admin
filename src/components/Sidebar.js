// src/components/Sidebar.js

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Input, Typography } from 'antd';
import CompanySelector from './CompanySelector';
import './Sidebar.css';

const { Sider } = Layout;
const { Search } = Input;
const { Title } = Typography;

const Sidebar = () => {
  const location = useLocation();

  // Defina as opções para cada página
  const menuOptions = {
    '/home/max-fibra': [
      { name: 'Dashboard', href: '/home' },
      { name: 'Consulta CNPJ', href: '/home/max-fibra/consultaCNPJ' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },

    ],
    '/home/vir-telecom': [
      { name: 'Opção 1 - Vir', href: '/vir-telecom/opcao1' },
      { name: 'Opção 2 - Vir', href: '/vir-telecom/opcao2' },
    ],
    '/home/reis-services': [
      { name: 'Opção 1 - Reis', href: '/reis-services/opcao1' },
      { name: 'Opção 2 - Reis', href: '/reis-services/opcao2' },
    ],
    '/home/max-fibra/consultaCNPJ': [
      { name: 'Pagina Inicial', href: '/max-fibra' },
      { name: 'Consulta CPF', href: '/max-fibra/consultaCPF' },
    ],
    '/home/max-fibra/consultaCPF': [
      { name: 'Pagina Inicial', href: '/max-fibra' },
      { name: 'Consulta CNPJ', href: '/max-fibra/consultaCNPJ' },
    ],
    '/home/max-fibra/cadastro':[
    { name: 'Pagina inical', href: '/home' },
    ],
    '/home':[
      { name: 'Pagina Inicial', href: '/home/max-fibra' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },
      ],
  };

  const currentPath = location.pathname;
  const options = menuOptions[currentPath] || [];

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
    </Sider>
  );
};

export default Sidebar;
