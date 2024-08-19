import React from 'react';
//import { Card } from 'antd';
import Sidebar from '../components/Sidebar';
import LinkItem from '../components/LinkItem';
import './styles/MaxFibra.css';




  const MaxFibra = () => {
    const sections = [
      //PROGRAMA IXC PROVEDOR  ==========================
      {
          title: 'Programas IXC',
          links: [
          { url: 'https://ixc.maxfibraltda.com.br/adm.php', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/IXC-PROVEDOR.png', altText: 'IXC', text: 'IXC', popupText: 'Para acessar esse atalho é <br>necessário fazer <strong> <a href="https://ixc.maxfibraltda.com.br/adm.php" target="_blank" rel="noopener noreferrer">Login</a></strong>' },
          { url: 'https://ixc.maxfibraltda.com.br/mapas.php?mode=fiber', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/IXC-IMAP.png', altText: 'IXC - FiberDocs', text: 'IXC - Imap' },
          { url: 'https://ixc.maxfibraltda.com.br/mapas.php?mode=service', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/IXC-SERVICE.png', altText: 'IXC - Service', text: 'IXC - Service' },
          { url: 'https://acs.maxfibraltda.com.br/', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/PRO-1-1.gif', altText: 'IXC - ACS', text: 'IXC - ACS' },
          ],
      },
      //PROGRAMA IXC PROVEDOR  ==========================
  
      //PROGRAMA ATENDIMENTO AO PUBLICO  =================
      {
          title: 'Atendimento ao Publico',
          links: [
          {url: 'https://maxfibra.opasuite.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/OPA-Max.png', altText: 'Opa! Suite',  text: 'OpaSuite!' },
          {url: 'https://chatwoot.nexusnerds.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/PRO-1.gif', altText: 'Chatwoot', text: 'Chatwoot' },
          ],
      },
      //PROGRAMA ATENDIMENTO AO PUBLICO   ================
  
      //PROGRAMA R8 =======================================
      {
          title: 'Programa R8',
          links: [
          { url: 'https://www.r8rastreadores.com.br/map', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/R8-RASTREIO-1.jpg', altText: 'R8 - RASTREIO', text: 'R8 Rastreadores' },
          ],
      },
  
      //PROGRAMA R8 =======================================
      //PROGRAMA ANALISE E MONITORAMENTO  =================
      {
          title: 'Analise e Monitoramento',
          links: [
          { url: 'https://grupomaxltda.smartolt.com/', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/SMART-OLT.png', altText: 'SMART-OLT', text: 'Smart-Olt', isEquipamentos: false,},
          { url: 'http://172.25.255.20:3000/login', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Grafana.png', altText: 'GRAFANA',text: 'Grafana'  },
          ],
      },
      //PROGRAMA ANALISE E MONITORAMENTO  ================
  
      //PROGRAMA ADMINISTRAÇÃO  ==========================
      {
          title: 'Administração e Controle',
          links: [
          {url: 'https://autenticador.secullum.com.br/Authorization?response_type=code&client_id=3&redirect_uri=https%3A%2F%2Fpontoweb.secullum.com.br%2FAuth', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Secullum.png', altText: 'SECULLUM', text: 'Secullum - Ponto'},
          {url: 'https://credlocaliza.com.br/sistema/account/login',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/CRED-LOCALIZA.jpg', altText: 'CredLocaliza', text: 'CredLocaliza' },
          {url: 'https://www.playhub.com.br/APP/Login',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/07/Copia-de-PRO.gif', altText: 'PlayHub', text: 'PlayHub' },
          {url: 'https://maxfibra.myog.io/admin/',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/08/DATACAKE.png', altText: 'Area Administração - Totem', text: 'Area Administração - Totem' },
          {url: 'https://grupomax.github.io/Gerador_Proposta_Comercial/',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/08/PropostaComecial.jpg', altText: 'Gerador de Proposta', text: 'Gerador de Proposta', isIframe: true},
          ],
      },
      //PROGRAMA ADMINISTRAÇÃO  ==========================
  
      //PROGRAMA PROGRAMAS UTEIS  ========================
      {
          title: 'Programas úteis',
          links: [
          {url: 'https://www.canva.com/pt_br/',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Canva.png', altText: 'Canva',text: 'Canva', popupText: 'Para acessar esse atalho é <br> necessário está conectado em uma <br>conta do <strong>Grupo Max</strong>' },
          {url: 'https://mail.google.com/mail',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/gmail.png', altText: 'Gmail', text: 'Gmail' },
          {url: 'https://trello.com/u/grupomax4/boards',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Trello.png', altText: 'Trello', text: 'Trello' },
          {url: 'https://warnerbros.ent.box.com/s/ykklojfiaf7taxwfnwsdapsybbbxjrev',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/PRO-3.gif',altText: 'Driver', text: 'Driver - PlayHub'},
              ],
      },
      //PROGRAMA PROGRAMAS UTEIS  ========================
  
    ];
  
    return (
      <div className="max-fibra">
        <Sidebar />
        <div className="content-max-fibra">
          {sections.map((section, index) => (
            <div key={index}>
              <h2>{section.title}</h2>
              <div className="link-container-max-fibra">
                {section.links.map((link, idx) => (
                  <LinkItem key={idx} {...link} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default MaxFibra;
  
