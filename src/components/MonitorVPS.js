import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Row, Col, Card } from 'antd';
import { ConsoleSqlOutlined, BarChartOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './MonitorVPS.css'; // Certifique-se de que esse arquivo existe e está corretamente configurado

const { Header, Content } = Layout;
const { Title } = Typography;

function MonitorVPS() {
  const [terminalOutput, setTerminalOutput] = useState('');
  const [pm2Processes, setPm2Processes] = useState([]);
  const [vpsOverview, setVpsOverview] = useState({
    CPU: 'N/A',
    'Memória Total': 'N/A',
    'Memória Usada': 'N/A',
    'Espaço em Disco': 'N/A',
    Uptime: 'N/A'
  });
  const [isError, setIsError] = useState(false);

  const executeCommand = async (command) => {
    try {
      const response = await fetch('https://api.comand.nexusnerds.com.br/executar-comando', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comando: command }),
      });

      const result = await response.text();
      setTerminalOutput(prev => prev + '\n' + result);
      setIsError(false);
    } catch (error) {
      console.error(`Erro de execução: ${error.message}`);
      setTerminalOutput(prev => prev + '\nErro de execução: ' + error.message);
      setIsError(true);
    }
  };

  const fetchPm2Monit = async () => {
    try {
      const response = await fetch('https://api.comand.nexusnerds.com.br/executar-comando', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comando: 'pm2 monit' }),
      });

      const data = await response.json();
      if (response.ok) {
        setPm2Processes(data);
        setIsError(false);
      } else {
        setPm2Processes([]);
        setIsError(true);
      }
    } catch (error) {
      console.error(`Erro ao buscar PM2 monit: ${error.message}`);
      setIsError(true);
    }
  };

  const fetchVpsOverview = async () => {
    try {
      const response = await fetch('https://api.comand.nexusnerds.com.br/vps-overview', {
        method: 'GET',
      });

      const data = await response.json();
      setVpsOverview(data);
      setIsError(false);
    } catch (error) {
      console.error(`Erro ao buscar visão geral da VPS: ${error.message}`);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchPm2Monit();
    fetchVpsOverview();

    const intervalId = setInterval(() => {
      fetchPm2Monit();
      fetchVpsOverview();
    }, 180000); // 180000ms = 3 minutos

    return () => clearInterval(intervalId); // Limpa o intervalo quando o componente for desmontado
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#001529', padding: '0 16px' }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>Monitoramento da VPS</Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card title="Terminal" bordered={false} style={{ minHeight: 300 }}>
              <pre>{terminalOutput || 'Terminal vazio...'}</pre>
              <div style={{ marginTop: 16 }}>
                <Button type="primary" icon={<ConsoleSqlOutlined />} onClick={() => executeCommand('uname -a')}>Sistema</Button>
                <Button type="primary" icon={<BarChartOutlined />} onClick={() => executeCommand('df -h')} style={{ marginLeft: 8 }}>Espaço em Disco</Button>
                <Button type="primary" icon={<InfoCircleOutlined />} onClick={() => executeCommand('uptime')} style={{ marginLeft: 8 }}>Uptime</Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="PM2 Monit" bordered={false} style={{ minHeight: 300 }}>
              {pm2Processes.length > 0 ? (
                pm2Processes.map((proc, index) => (
                  <div key={index}>
                    <strong>Nome:</strong> {proc.name} | <strong>Status:</strong> {proc.status} | <strong>CPU:</strong> {proc.cpu}% | <strong>Memória:</strong> {proc.memory}
                  </div>
                ))
              ) : (
                <p>Nenhuma informação disponível</p>
              )}
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Visão Geral da VPS" bordered={false} style={{ minHeight: 300 }}>
              <div><strong>CPU:</strong> {vpsOverview.CPU}</div>
              <div><strong>Memória Total:</strong> {vpsOverview['Memória Total']} MB</div>
              <div><strong>Memória Usada:</strong> {vpsOverview['Memória Usada']} MB</div>
              <div><strong>Espaço em Disco:</strong> {vpsOverview['Espaço em Disco']}</div>
              <div><strong>Uptime:</strong> {vpsOverview.Uptime}</div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default MonitorVPS;
