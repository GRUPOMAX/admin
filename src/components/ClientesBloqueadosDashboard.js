import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spin, Typography } from 'antd'; // Importando componentes do Ant Design
import './ClientesBloqueadosDashboard.css';

const { Title, Text } = Typography;

const ClientesBloqueadosDashboard = () => {
  const [clientesBloqueados, setClientesBloqueados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientesBloqueados = async () => {
      try {
        // Definir baseURL dependendo do ambiente
        const baseURL = process.env.NODE_ENV === 'production' 
          ? 'https://www.apidoixc.nexusnerds.com.br'
          : '';

        const response = await axios.get(`${baseURL}/filtered_count`);
        const count = Number(response.data.count);
        setClientesBloqueados(count);
      } catch (error) {
        setError('Erro ao buscar os dados.');
        console.error('Erro ao fazer a requisição:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientesBloqueados();
  }, []);

  return (
    <Card
      className="clientes-bloqueados-dashboard"
      bordered={false}
      style={{
        width: 300,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)', // Adiciona sombra ao Card
        borderRadius: '8px', // Adiciona bordas arredondadas
        padding: '20px', // Adiciona espaçamento interno
        backgroundColor: '#f5222d' // Cor de fundo vermelho personalizada
      }}
    >
      <Title level={3} style={{ color: 'white' }}>Clientes Bloqueados</Title>
      {loading ? (
        <Spin />
      ) : error ? (
        <Text type="danger" style={{ fontSize: '16px' }}>{error}</Text>
      ) : (
        <Text style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
          {clientesBloqueados !== null ? clientesBloqueados : 'N/A'}
        </Text>
      )}
    </Card>
  );
};

export default ClientesBloqueadosDashboard;
