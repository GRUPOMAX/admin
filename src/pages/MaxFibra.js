import React from 'react';
import Sidebar from '../components/Sidebar';
import LinkItem from '../components/LinkItem';
import './styles/MaxFibra.css';

const accessPermissions = {
  Administrador: ['IXC', 'IXCMapas','IXCService','IXCAcs',  'R8Rastreadores', 'OpaSuite', 'CredLocaliza', 'Canva', 'Gmail', 'Trello', 'SmartOLT','Grafana', 'Dpv-Vendas', 'Secullum', 'CredLocaliza', 'PLayHUB', 'Totem', 'Playhub-biblioteca', 'GeradorProposta', 'ConsultaCPF', 'SSA'],
  Desenvolvedor: ['Chatwoot','IXC', 'IXCMapas','IXCService','IXCAcs',  'R8Rastreadores', 'OpaSuite', 'CredLocaliza', 'Canva', 'Gmail', 'Trello', 'SmartOLT','Grafana', 'Dpv-Vendas', 'Secullum', 'CredLocaliza', 'PLayHUB', 'Totem', 'Playhub-biblioteca', 'GeradorProposta', 'ConsultaCPF', 'SSA'],
  Financeiro: ['IXC', 'IXCMapas','IXCService','IXCAcs',  'Secullum', 'OpaSuite', 'CredLocaliza', 'Canva', 'Gmail', 'Trello', 'SmartOLT', 'OpaSuite', 'CredLocaliza','SSA', 'ConsultaCPF'],
  Vendedor: ['Canva', 'Gmail', 'Trello', 'ConsultaCPF'],
};

const MaxFibra = ({ userProfile }) => {
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
      title: 'Programas IXC',
      links: [
        { id: 'IXC', url: 'https://ixc.maxfibraltda.com.br/adm.php', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/IXC-PROVEDOR.png', altText: 'IXC', text: 'IXC', popupText: 'Para acessar esse atalho é <br>necessário fazer <strong> <a href="https://ixc.maxfibraltda.com.br/adm.php" target="_blank" rel="noopener noreferrer">Login</a></strong>'},
        { id: 'IXCMapas', url: 'https://ixc.maxfibraltda.com.br/mapas.php?mode=fiber', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/IXC-IMAP.png', altText: 'IXC - FiberDocs', text: 'IXC - Imap' },
        { id: 'IXCService', url: 'https://ixc.maxfibraltda.com.br/mapas.php?mode=service', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/IXC-SERVICE.png', altText: 'IXC - Service', text: 'IXC - Service' },
        { id: 'IXCAcs', url: 'https://acs.maxfibraltda.com.br/', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/PRO-1-1.gif', altText: 'IXC - ACS', text: 'IXC - ACS' },
      ],
    }, //PROGRAMA ANALISE E MONITORAMENTO  =================
    {
      title: 'Analise e Monitoramento',
      links: [
            { id:'SmartOLT' ,url: 'https://grupomaxltda.smartolt.com/', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/SMART-OLT.png', altText: 'SMART-OLT', text: 'Smart-Olt'},
            { id:'Grafana' , url: 'http://172.25.255.20:3000/login', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Grafana.png', altText: 'GRAFANA',text: 'Grafana'  },
            { id: 'R8Rastreadores', url: 'https://www.r8rastreadores.com.br/map', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/R8-RASTREIO-1.jpg', altText: 'R8 - RASTREIO', text: 'R8 Rastreadores' },
          ],
    },
    //PROGRAMA ADMINISTRAÇÃO  ==========================
    {
      title: 'Administração e Controle',
      links: [
        { id:'Secullum' ,url: 'https://autenticador.secullum.com.br/Authorization?response_type=code&client_id=3&redirect_uri=https%3A%2F%2Fpontoweb.secullum.com.br%2FAuth', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Secullum.png', altText: 'SECULLUM', text: 'Secullum - Ponto'},
        { id:'CredLocaliza' ,url: 'https://credlocaliza.com.br/sistema/account/login',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/CRED-LOCALIZA.jpg', altText: 'CredLocaliza', text: 'CredLocaliza' },
        { id:'PLayHUB' ,url: 'https://www.playhub.com.br/APP/Login',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/07/Copia-de-PRO.gif', altText: 'PlayHub', text: 'PlayHub' },
        { id:'Totem' ,url: 'https://maxfibra.myog.io/admin/',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/08/DATACAKE.png', altText: 'Area Administração - Totem', text: 'Area Administração - Totem' },
        { id:'GeradorProposta' ,url: 'https://grupomax.github.io/Gerador_Proposta_Comercial/',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/08/PropostaComecial.jpg', altText: 'Gerador de Proposta', text: 'Gerador de Proposta' },
        { id: 'ConsultaCPF', url: 'https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/08/PRO.gif', altText: 'CPF CONSULTA', text: 'Consulta CPF' },
      ],
    },
    {
      title: 'Atendimento ao Publico',
      links: [
        { id: 'OpaSuite', url: 'https://maxfibra.opasuite.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/OPA-Max.png', altText: 'Opa! Suite', text: 'OpaSuite!' },
        { id: 'Chatwoot', url: 'https://chatwoot.nexusnerds.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/PRO-1.gif', altText: 'Chatwoot', text: 'Chatwoot' },
      ],
    },
    //PROGRAMA PROGRAMAS UTEIS  ========================
    {
      title: 'Programas úteis',
      links: [
        { id:'Canva' ,url: 'https://www.canva.com/pt_br/',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Canva.png', altText: 'Canva',text: 'Canva', popupText: 'Para acessar esse atalho é <br> necessário está conectado em uma <br>conta do <strong>Grupo Max</strong>' },
        { id:'Gmail' ,url: 'https://mail.google.com/mail',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/gmail.png', altText: 'Gmail', text: 'Gmail' },
        { id:'trello' ,url: 'https://trello.com/u/grupomax4/boards',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Trello.png', altText: 'Trello', text: 'Trello' },
        { id:'Playhub-biblioteca' ,url: 'https://warnerbros.ent.box.com/s/ykklojfiaf7taxwfnwsdapsybbbxjrev',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/PRO-3.gif',altText: 'Driver', text: 'Driver - PlayHub'},
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

export default MaxFibra;
