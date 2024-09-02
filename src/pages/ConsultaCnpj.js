import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import axios from 'axios';
import './styles/ConsultaCnpj.css';

const { Title, Text } = Typography;

const ConsultaCnpj = () => {
  const [cnpj, setCnpj] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
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
    <div className="consulta-cnpj-container">
<Card style={{ maxWidth: 800, width: '100%', padding: '20px', borderRadius: '8px' }}>

<Title level={3}>Consulta de CNPJ</Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Digite o CNPJ"
            validateStatus={error ? "error" : ""}
            help={error || ""}
          >
            <Input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Consultar
          </Button>
        </Form>

        {companyData && (
          <div className="company-data">
            <Title level={4}>{companyData.nome}</Title>
            <p><Text strong>CNPJ:</Text> {companyData.cnpj}</p>
            <p><Text strong>Abertura:</Text> {companyData.abertura}</p>
            <p><Text strong>Situação:</Text> {companyData.situacao}</p>
            <p><Text strong>Tipo:</Text> {companyData.tipo}</p>
            <p><Text strong>Porte:</Text> {companyData.porte}</p>
            <p><Text strong>Natureza Jurídica:</Text> {companyData.natureza_juridica}</p>
            <p><Text strong>Atividade Principal:</Text> {companyData.atividade_principal[0].text} ({companyData.atividade_principal[0].code})</p>
            <p><Text strong>Endereço:</Text> {companyData.logradouro}, {companyData.numero} {companyData.complemento}, {companyData.bairro}, {companyData.municipio} - {companyData.uf}, CEP: {companyData.cep}</p>
            <p><Text strong>Telefone:</Text> {companyData.telefone}</p>
            <p><Text strong>Última Atualização:</Text> {new Date(companyData.ultima_atualizacao).toLocaleString()}</p>
            <Title level={5}>Quadro de Sócios e Administradores:</Title>
            <ul>
              {companyData.qsa.map(person => (
                <li key={person.nome}>{person.nome} - {person.qual}</li>
              ))}
            </ul>
            <div className="footer">
              <Text strong>Consulta realizada em:</Text> {new Date().toLocaleString()} - <Text strong>by Jota</Text>
            </div>
          </div>
        )}

        {error && (
          <Alert message="Erro" description={error} type="error" showIcon style={{ marginTop: 20 }} />
        )}
      </Card>
    </div>
  );
};

export default ConsultaCnpj;
