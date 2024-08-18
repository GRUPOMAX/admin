import React from 'react';
import Sidebar from '../components/Sidebar';
import LinkItem from '../components/LinkItem';
import './styles/VirTelecom.css'

const VirTelecom = () => {
        const sections = [
            //PROGRAMA IXC PROVEDOR  ==========================
            {
                title: 'Programas Administração',
                links: [
                { url: 'https://vir.ispcloud.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/ISP-CLOUD.jpg', altText: 'ISP-Cloud', text: 'ISP'},
                { url: 'https://portaloperacional.vtal.com.br/portal', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/07/PORTAL-VTAL.jpg', altText: 'Portal Operacional', text: 'Portal Operacional', popupText: 'Caso a Tela esteja em Branco <br>Clique <strong> <a href="https://portaloperacional.vtal.com.br/" target="_blank" rel="noopener noreferrer">Login</a></strong>' },
                ],
            },
            //PROGRAMA IXC PROVEDOR  ==========================
        
            //PROGRAMA ATENDIMENTO AO PUBLICO  =================
            {
                title: 'Atendimento ao Publico',
                links: [
                {url: 'https://vir.opasuite.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/OPA-VIR.jpg', altText: 'Opa! Suite',  text: 'OpaSuite!' },
                {url: 'https://chatwoot.nexusnerds.com.br', imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/06/PRO-1.gif', altText: 'Chatwoot', text: 'Chatwoot' },
                ],
            },
            //PROGRAMA ATENDIMENTO AO PUBLICO   ================
        
            //PROGRAMA ADMINISTRAÇÃO  ==========================
            {
                title: 'Administração e Controle',
                links: [
                {url: 'https://app.powerbi.com/view?r=eyJrIjoiMjAzODkwOTQtOTRiOS00OGM0LTgzMzktOWE4YzZjNzdiNmUyIiwidCI6IjljZTY2NzI4LThmZmQtNDEzNS1hZTFkLTNiMmUyNjVlMjhlOSJ9',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/07/powerBI.jpg', altText: 'DFV',text: 'DFV', isIframe: true},
                ],
            },
            //PROGRAMA ADMINISTRAÇÃO  ==========================
        
            //PROGRAMA PROGRAMAS UTEIS  ========================
            {
                title: 'Programas úteis',
                links: [
                {url: 'https://www.canva.com/pt_br/',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Canva.png', altText: 'Canva',text: 'Canva', popupText: 'Para acessar esse atalho é <br> necessário está conectado em uma <br>conta do <strong>Grupo Max</strong>' },
                {url: 'https://trello.com/u/grupomax4/boards',imgSrc: 'https://maxfibraltda.com.br/wp-content/uploads/2024/05/Trello.png', altText: 'Trello', text: 'Trello' },
                    ],
            },
            //PROGRAMA PROGRAMAS UTEIS  ========================
        
        ];
    
    
      return (
        <div className="home-virtelecom">
          <Sidebar />
          <div className="content-virtelecom">
            {sections.map((section, index) => (
              <div key={index}>
                <h2>{section.title}</h2>
                <div className="link-container-virtelecom">
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

export default VirTelecom;
