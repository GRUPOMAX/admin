// src/pages/VirTelecom.js

import React from 'react';
import Sidebar from '../components/Sidebar';
import LinkItem from '../components/LinkItem';
import './styles/VirTelecom.css';

// Definindo permissões de acesso com base no cargo do usuário
const accessPermissions = {
  Administrador: ['ISP', 'PortalOperacional', 'OpaSuite', 'Chatwoot', 'DFV', 'ConsultaCPF', 'Canva', 'Trello'],
  Desenvolvedor: ['ISP', 'PortalOperacional', 'OpaSuite', 'Chatwoot', 'DFV', 'ConsultaCPF', 'Canva', 'Trello'],
  Financeiro: ['ISP', 'PortalOperacional','DFV', 'ConsultaCPF','OpaSuite', 'Canva', 'Trello'],
  Vendedor: ['ISP','OpaSuite', 'Chatwoot', 'Canva', 'Trello'],
};

const VirTelecom = ({ userProfile }) => {
  // Verifique se userProfile e Cargo1 estão corretamente definidos
  const cargo = userProfile?.Cargo1 || userProfile?.cargo1 || userProfile?.Cargo;
  if (!userProfile || !cargo) {
    console.error("Erro: Cargo não está definido ou userProfile é inválido:", userProfile);
    return <p>Erro: Perfil de usuário inválido.</p>;
  }

  const sections = [
    {
      title: 'Programas Administração',
      links: [
        { id: 'ISP', url: 'https://vir.ispcloud.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/ISP-CLOUD.jpg', altText: 'ISP-Cloud', text: 'ISP' },
        { id: 'PortalOperacional', url: 'https://portaloperacional.vtal.com.br/portal', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/07/PORTAL-VTAL.jpg', altText: 'Portal Operacional', text: 'Portal Operacional', popupText: 'Caso a Tela esteja em Branco <br>Clique <strong> <a href="https://portaloperacional.vtal.com.br/" target="_blank" rel="noopener noreferrer">Login</a></strong>' },
      ],
    },
    {
      title: 'Atendimento ao Publico',
      links: [
        { id: 'OpaSuite', url: 'https://vir.opasuite.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/OPA-VIR.jpg', altText: 'Opa! Suite', text: 'OpaSuite!' },
        { id: 'Chatwoot', url: 'https://chatwoot.nexusnerds.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/PRO-1.gif', altText: 'Chatwoot', text: 'Chatwoot' },
      ],
    },
    {
      title: 'Administração e Controle',
      links: [
        { id: 'DFV', url: 'https://app.powerbi.com/view?r=eyJrIjoiMjAzODkwOTQtOTRiOS00OGM0LTgzMzktOWE4YzZjNzdiNmUyIiwidCI6IjljZTY2NzI4LThmZmQtNDEzNS1hZTFkLTNiMmUyNjVlMjhlOSJ9', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/07/powerBI.jpg', altText: 'DFV', text: 'DFV', isIframe: true },
        { id: 'ConsultaCPF', url: 'https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/08/PRO.gif', altText: 'CPF CONSULTA', text: 'Consulta CPF' },
      ],
    },
    {
      title: 'Programas úteis',
      links: [
        { id: 'Canva', url: 'https://www.canva.com/pt_br/', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Canva.png', altText: 'Canva', text: 'Canva', popupText: 'Para acessar esse atalho é <br> necessário estar conectado em uma <br>conta do <strong>Grupo Max</strong>' },
        { id: 'Trello', url: 'https://trello.com/u/grupomax4/boards', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Trello.png', altText: 'Trello', text: 'Trello' },
      ],
    },
  ];

  // Filtrando os links com base no cargo do usuário
  const filteredSections = sections.map((section) => ({
    ...section,
    links: section.links.filter((link) => accessPermissions[cargo]?.includes(link.id)),
  }));

  return (
    <div className="home-virtelecom">
      <Sidebar />
      <div className="content-virtelecom">
        {filteredSections.map((section, index) => (
          <div key={index}>
            <h2>{section.title}</h2>
            <div className="link-container-virtelecom">
              {section.links.length > 0 ? (
                section.links.map((link, idx) => (
                  <LinkItem key={idx} {...link} />
                ))
              ) : (
                <p>Sem Autorização</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirTelecom;
