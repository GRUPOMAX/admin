import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import './styles/Home.css';

const Home = ({ userProfile }) => {
  const [statusData, setStatusData] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const { data } = await axios.get('https://apidoixc.nexusnerds.com.br/Data/Resultados_Status.json');
        setStatusData(data.contagem);
      } catch (error) {
        console.error('Erro ao buscar os dados de status:', error);
      }
    };

    fetchStatusData();
  }, []);

  useEffect(() => {
    const savedTimeRemaining = localStorage.getItem('timeRemaining');
    if (savedTimeRemaining && savedTimeRemaining > 0) {
      setTimeRemaining(parseInt(savedTimeRemaining));
      setIsButtonDisabled(true);
    }
  }, []);

  useEffect(() => {
    if (isButtonDisabled && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem('timeRemaining', newTime);

          if (newTime <= 0) {
            clearInterval(interval);
            setIsButtonDisabled(false);
            localStorage.removeItem('timeRemaining'); // Remove o timer quando chega a 0
          }

          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isButtonDisabled, timeRemaining]);

  const handleButtonClick = async () => {
    setIsButtonDisabled(true);
    setTimeRemaining(180); // 180 segundos = 3 minutos
    localStorage.setItem('timeRemaining', 180);

    try {
      await executeCommand('node /api_ixc/dashboard/Flashupdate.js && node /api_ixc/dashboard/ButtonUpdateData.js');
      message.success('Comando executado com sucesso!');
    } catch (error) {
      console.error('Erro ao executar o comando:', error);
      message.error('Erro ao executar o comando.');
    }
  };

  const executeCommand = async (command) => {
    try {
      const response = await fetch('https://api.comand.nexusnerds.com.br/executar-comando', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comando: command }),
      });

      if (!response.ok) {
        throw new Error('Erro ao executar o comando');
      }

      const result = await response.json();
      console.log(result); // Log do resultado (opcional)
    } catch (error) {
      console.error(`Erro de execução: ${error.message}`);
      throw error;
    }
  };

  const getCardStyle = (type) => {
    switch (type) {
      case 'online':
        return { backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' };
      case 'offline':
        return { backgroundColor: '#ffa726', borderColor: '#fb8c00', color: '#bf360c' };
      case 'los':
        return { backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' };
      default:
        return {};
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card
            title="ONUs Online"
            bordered={false}
            style={getCardStyle('online')}
          >
            <p>{statusData.online !== undefined ? statusData.online : 'Carregando...'}</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="ONUs Desligados"
            bordered={false}
            style={getCardStyle('offline')}
          >
            <p>{statusData.offline !== undefined ? statusData.offline : 'Carregando...'}</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="ONU (LOS)"
            bordered={false}
            style={getCardStyle('los')}
          >
            <p>{statusData.los !== undefined ? statusData.los : 'Carregando...'}</p>
          </Card>
        </Col>
      </Row>
      <div className="action-buttons" style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button type="primary" onClick={() => navigate('/home/detalhes-dispositivos')} style={{ marginRight: '10px' }}>
          Análise Detalhada
        </Button>
        <Button
          type="primary"
          onClick={handleButtonClick}
          disabled={isButtonDisabled}
          icon={<ReloadOutlined />} // Adicionando o ícone de recarregar
        >
          {isButtonDisabled ? `Aguarde ${timeRemaining}s` : ''}
        </Button>
      </div>
    </div>
  );
};

export default Home;
