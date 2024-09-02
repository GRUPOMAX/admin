import React from 'react';
import Sidebar from '../components/Sidebar';
import LinkItem from '../components/LinkItem';
import './styles/ReisServices.css';

const accessPermissions = {
  Loja: ['SigeCloud', 'Canva','Gmail','driver', 'Sigecloud-Adm'],
  Administrador: ['SigeCloud', 'Canva','Gmail','driver', 'Sigecloud-Adm'],
  Dev: ['SigeCloud', 'Canva','Gmail','driver', 'Sigecloud-Adm']
};

const ReisServices = ({ userProfile }) => {
  // Acessando o cargo do usuário
  const cargo = userProfile?.Cargo1;
  console.log('User Profile',userProfile);

  // Verifique se o cargo está corretamente definido
  if (!userProfile || !cargo) {
    console.error("Erro: Cargo não está definido ou userProfile é inválido:", userProfile);
    return <p>Erro: Perfil de usuário inválido.</p>;
  }

  const sections = [
    {
      title: 'Atalhos Administrativos',
      links: [
        { id: 'SigeCloud', url: 'https://app.sigecloud.com.br/Login.aspx', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/SIGE-CLOUD.jpg', altText: 'SigeCloud', text: 'IXC Admin', popupText: 'Para acessar esse atalho é <br>necessário fazer <strong> Fazer Login'},
      ],
    },
    //PROGRAMA ADMINISTRAÇÃO  ==========================
    {
      title: 'Administração e Controle',
      links: [
        { id:'Sigecloud-Adm' ,url: 'https://app.sigecloud.com.br/pdv', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/SIGE-CLOUD-CAIXA.jpg', altText: 'SigeCloud-Caixa', text: 'SigeCloud - Caixa'},],
    },
    //PROGRAMA PROGRAMAS UTEIS  ========================
    {
      title: 'Atalhos úteis',
      links: [
        { id:'Canva' ,url: 'https://www.canva.com/pt_br/',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Canva.png', altText: 'Canva',text: 'Canva', popupText: 'Para acessar esse atalho é <br> necessário está conectado em uma <br>conta do <strong>Grupo Max</strong>' },
        { id:'Gmail' ,url: 'https://drive.google.com/drive/folders/1j55i0j7FnzWh_a2DOgJNaDZW6vt9_zrs?usp=sharing',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/07/Fechamento.jpg', altText: 'Fechamento', text: 'Fechamento' },
        { id:'driver' ,url: 'https://drive.google.com/drive/folders/1hyL5kDz5xpyepVsu5MMHvxWonzMnSAJN?usp=sharing',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/07/GOOGLE-DRIVER.jpg', altText: 'Google Driver Reis Service', text: 'Google Driver - Reis Service', popupText: 'Para acessar esse atalho é <br> necessário está conectado em uma <br>conta do <strong>Grupo Max</strong>' },
          ],
    },
    //PROGRAMA PROGRAMAS UTEIS  ========================
  ];

  // Filtrando os links com base no cargo do usuário
  const filteredSections = sections.map((section) => ({
    ...section,
    links: section.links.filter((link) => accessPermissions[cargo]?.includes(link.id)),
  }));

  return (
    <div className="max-fibra">
      <Sidebar />
      <div className="content-max-fibra">
        {filteredSections.map((section, index) => (
          <div key={index}>
            <h2>{section.title}</h2>
            <div className="link-container-max-fibra">
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

export default ReisServices;
