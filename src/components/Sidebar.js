// src/components/Sidebar.js

import './Sidebar.css';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import CompanySelector from './CompanySelector'; // Importe o novo componente

const Sidebar = () => {
  const location = useLocation();

  // Defina as opções para cada página
  const menuOptions = {
    '/area_administrativa/max-fibra': [
      { name: 'Consulta CNPJ', href: '/area_administrativa/max-fibra/consultaCNPJ' },
      { name: 'Consulta CPF', href: '/area_administrativa/max-fibra/consultaCPF' },
      { name: 'Opção Nª 3', href: '/max-fibra/opcao2' },
    ],
    '/area_administrativa/vir-telecom': [
      { name: 'Opção 1 - Vir', href: '/vir-telecom/opcao1' },
      { name: 'Opção 2 - Vir', href: '/vir-telecom/opcao2' },
    ],
    '/area_administrativa/reis-services': [
      { name: 'Opção 1 - Reis', href: '/reis-services/opcao1' },
      { name: 'Opção 2 - Reis', href: '/reis-services/opcao2' },
    ],
    '/area_administrativa/max-fibra/consultaCNPJ': [
      { name: 'Pagina Inicial', href: '/max-fibra' },
      { name: 'Consulta CPF', href: '/max-fibra/consultaCPF' },
    ]    ,
    '/area_administrativa/max-fibra/consultaCPF': [
      { name: 'Pagina Inicial', href: '/max-fibra' },
      { name: 'Consulta CNPJ', href: '/max-fibra/consultaCNPJ' },
    ]
  };

  const currentPath = location.pathname;
  const options = menuOptions[currentPath] || [];

  return (
    <div className="sidebar">
      <div className="search-bar">
        <input type="text" placeholder="Pesquisa..." />
        <button>Search</button>
      </div>
      <div className="dynamic-menu">
        {options.length > 0 && (
          <>
            <h2>Menu</h2>
            <ul>
              {options.map((option, index) => (
                <li key={index}>
                  <Link to={option.href}>{option.name}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <CompanySelector /> {/* Adicione o novo componente aqui */}
    </div>
  );
};

export default Sidebar;
