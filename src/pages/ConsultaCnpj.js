import React, { useState } from 'react';
import axios from 'axios';
import './styles/ConsultaCnpj.css'; // 




const ConsultaCnpj = () => {
    const [cnpj, setCnpj] = useState('');
    const [companyData, setCompanyData] = useState(null);
    const [error, setError] = useState('');
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setError('');
      
      const cleanedCnpj = cnpj.replace(/[^\d]+/g, '');
      
      if (cleanedCnpj.length !== 14) {
        setError('Por favor, insira um CNPJ válido com 14 dígitos.');
        return;
      }
      
      await fetchCompanyData(cleanedCnpj);
    };
  
    const fetchCompanyData = async (cnpj) => {
      try {
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `https://www.receitaws.com.br/v1/cnpj/${cnpj}`;
        const response = await axios.get(proxyUrl + encodeURIComponent(apiUrl));
  
        if (response.status !== 200) {
          throw new Error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
        }
  
        const data = response.data;
  
        if (data.status === 'ERROR') {
          throw new Error(data.message || 'Erro desconhecido');
        }
  
        setCompanyData(data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError(error.message);
        setCompanyData(null);
      }
    };
  
    return (
      <div className="consulta-cnpj">
        <h1>Consulta de CNPJ</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cnpj">Digite o CNPJ:</label>
            <input
              type="text"
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00000000000000"
              required
            />
          </div>
          <button type="submit">Consultar</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        {companyData && (
          <div className="company-data">
            <h2>{companyData.nome}</h2>
            <p><span className="highlight">CNPJ:</span> {companyData.cnpj}</p>
            <p><span className="highlight">Abertura:</span> {companyData.abertura}</p>
            <p><span className="highlight">Situação:</span> {companyData.situacao}</p>
            <p><span className="highlight">Tipo:</span> {companyData.tipo}</p>
            <p><span className="highlight">Porte:</span> {companyData.porte}</p>
            <p><span className="highlight">Natureza Jurídica:</span> {companyData.natureza_juridica}</p>
            <p><span className="highlight">Atividade Principal:</span> {companyData.atividade_principal[0].text} ({companyData.atividade_principal[0].code})</p>
            <p><span className="highlight">Endereço:</span> {companyData.logradouro}, {companyData.numero} {companyData.complemento}, {companyData.bairro}, {companyData.municipio} - {companyData.uf}, CEP: {companyData.cep}</p>
            <p><span className="highlight">Telefone:</span> {companyData.telefone}</p>
            <p><span className="highlight">Última Atualização:</span> {new Date(companyData.ultima_atualizacao).toLocaleString()}</p>
            <h3>Quadro de Sócios e Administradores:</h3>
            <ul>
              {companyData.qsa.map(person => (
                <li key={person.nome}>{person.nome} - {person.qual}</li>
              ))}
            </ul>
            <div className="footer">
              <span className="highlight">Consulta realizada em:</span> {new Date().toLocaleString()} - <span className="highlight">by Jota</span>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default ConsultaCnpj;