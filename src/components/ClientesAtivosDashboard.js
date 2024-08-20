import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spin, Typography } from 'antd'; // Importando componentes do Ant Design
import './ClientesAtivosDashboard.css'; // Importe o CSS para estilos adicionais

const { Title, Text } = Typography;

const ClientesAtivosDashboard = () => {
  const [clientesAtivos, setClientesAtivos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientesAtivos = async () => {
      try {
        // Definir baseURL dependendo do ambiente
        const baseURL = process.env.NODE_ENV === 'production' 
          ? 'https://apidoixc.nexusnerds.com.br'
          : '';

        const response = await axios.get(`${baseURL}/resultado.json`);
        const totalAjustado = response; // Ajuste conforme necessário
        setClientesAtivos(totalAjustado);
      } catch (error) {
        setError('Erro ao buscar os dados.');
        console.error('Erro ao fazer a requisição:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientesAtivos();
  }, []);

  return (
    <Card
      className="clientes-ativos-dashboard"
      bordered={false}
      style={{
        width: 300,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adiciona sombra ao Card
        borderRadius: '8px', // Adiciona bordas arredondadas
        padding: '20px', // Adiciona espaçamento interno
        backgroundColor: '#52c41a' // Cor de fundo verde personalizada
      }}
    >
      <Title level={3} style={{ color: 'white' }}>Clientes Ativos</Title>
      {loading ? (
        <Spin />
      ) : error ? (
        <Text type="danger" style={{ fontSize: '16px' }}>{error}</Text>
      ) : (
        <Text style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
          {clientesAtivos !== null ? clientesAtivos : 'N/A'}
        </Text>
      )}
    </Card>
  );
};

export default ClientesAtivosDashboard;
