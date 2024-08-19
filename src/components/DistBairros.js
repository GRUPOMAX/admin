import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spin, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './DistBairros.css'; // Importando o CSS

const { Title, Text } = Typography;

const DistBairros = () => {
  const [bairrosData, setBairrosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBairrosData = async () => {
      try {
        // Definir baseURL dependendo do ambiente
        const baseURL = process.env.NODE_ENV === 'production' 
          ? 'https://apidoixc.nexusnerds.com.br'
          : '';

        const response = await axios.get(`${baseURL}/bairros_count.json`);
        console.log('Resposta da API:', response.data); // Exibe o resultado completo da requisição no console
        setBairrosData(response.data);
      } catch (error) {
        setError('Erro ao buscar os dados.');
        console.error('Erro ao fazer a requisição:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBairrosData();
  }, []);

  return (
    <Card
      className="dist-bairros-dashboard"
      bordered={false}
      style={{
        width: '100%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adiciona sombra ao Card
        borderRadius: '8px', // Adiciona bordas arredondadas
        padding: '20px', // Adiciona espaçamento interno
        backgroundColor: '#ffffff' // Cor de fundo branca
      }}
    >
      <Title level={3}>Distribuição dos Bairros</Title>
      {loading ? (
        <Spin />
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <div className="bar-chart-container" style={{ textAlign: 'center' }}>
          <BarChart width={900} height={300} data={bairrosData}>
            <XAxis dataKey="bairro" tick={false} /> {/* Oculta os labels do eixo X */}
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#04c21d" name="Casas Conectadas" /> {/* Atualiza o nome */}
          </BarChart>
        </div>
      )}
    </Card>
  );
};

export default DistBairros;
