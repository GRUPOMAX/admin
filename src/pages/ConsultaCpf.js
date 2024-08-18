// src/pages/ConsultaCpf.js

import React from 'react';
import './styles/ConsultaCpf.css';// Importe o CSS para estilização

const ConsultaCpf = () => {
  return (
    <div className="consulta-cpf">
      <h1>Consulta CPF</h1>
      <iframe 
        className="iframe-consulta" 
        src="https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp"
        title="Consulta CPF"
      ></iframe>
    </div>
  );
};


export default ConsultaCpf;
