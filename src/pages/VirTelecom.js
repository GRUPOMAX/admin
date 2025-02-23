import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import LinkItem from '../components/LinkItem';
import './styles/VirTelecom.css';

const VirTelecom = ({ userProfile }) => {
  const [sections, setSections] = useState([]);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    // Fetch data from the server
    fetch('https://api.dashboard.admin.nexusnerds.com.br/api/vir-links') // Certifique-se que essa é a rota correta
      .then(response => response.json())
      .then(data => {
        if (data && data.sections && data.accessPermissions) {
          setSections(data.sections);
          setPermissions(data.accessPermissions);
        } else {
          console.error('Formato de dados inválido:', data);
        }
      })
      .catch(error => console.error('Falha ao carregar seções:', error));
  }, []);

  if (!userProfile || !userProfile.Cargo1) {
    console.error("Erro: Cargo não está definido ou userProfile é inválido:", userProfile);
    return <p>Erro: Perfil de usuário inválido.</p>;
  }

  const cargo = userProfile.Cargo1;

  // Filtrando os links com base nas permissões carregadas
  const filteredSections = sections.map(section => ({
    ...section,
    links: section.links.filter(link => permissions[cargo]?.includes(link.id)),
  }));

  return (
    <div className="home-virtelecom">
      <Sidebar />
      <div className="content-virtelecom">
        {filteredSections.map((section, index) => (
          <div key={index}>
            <h2>{section.title}</h2>
            <div className="link-container-virtelecom">
              {section.links.length > 0 ? section.links.map((link, idx) => (
                <LinkItem key={idx} {...link} />
              )) : (
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
