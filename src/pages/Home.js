import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Select, Spin } from 'antd';
import './styles/Home.css'; // Importando o CSS separado

const { Option } = Select;

// Usando React.lazy para carregar os dashboards sob demanda
const AnaliseTecnicaDashboard = React.lazy(() => import('./AnaliseTecnicaDashboard'));
const CobrancaDashboard = React.lazy(() => import('./CobrancaDashboard'));
const FinanceiroDashboard = React.lazy(() => import('./FinanceiroDashboard'));
const OrdensServicoDashboard = React.lazy(() => import('./OrdensServicoDashboard'));

const Home = () => {
  const [selectedDashboard, setSelectedDashboard] = useState('analiseTecnica');
  const [refreshKey, setRefreshKey] = useState(0); // Usado para forçar a re-renderização
  const [blockedClientsCount, setBlockedClientsCount] = useState(0); // Estado para o número de clientes bloqueados

  // Efeito para reiniciar o dashboard automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prevKey) => prevKey + 1); // Atualiza a chave de reinicialização, forçando a re-renderização
    }, 60000); // Reinicia a cada 60 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  useEffect(() => {
    // Fetch the blocked clients count when the component mounts
    const fetchBlockedClientsCount = async () => {
      try {
        const response = await fetch('https://apidoixc.nexusnerds.com.br/Data/ClientesBloquados.json');
        const data = await response.json();
        setBlockedClientsCount(data.length); // Supondo que o JSON contém uma lista de clientes bloqueados
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchBlockedClientsCount();
  }, []);

  const getColorForBlockedClients = (total) => {
    if (total > 50) {
      return 'red';
    } else if (total > 20) {
      return 'orange';
    } else {
      return 'green';
    }
  };

  const renderDashboard = useCallback(() => {
    switch (selectedDashboard) {
      case 'analiseTecnica':
        return <AnaliseTecnicaDashboard key={refreshKey} />;
      case 'cobranca':
        return <CobrancaDashboard key={refreshKey} />;
      case 'financeiro':
        return <FinanceiroDashboard key={refreshKey} />;
      case 'ordensServico':
        return <OrdensServicoDashboard key={refreshKey} />;
      default:
        return <AnaliseTecnicaDashboard key={refreshKey} />;
    }
  }, [selectedDashboard, refreshKey]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-selector">
        <h3>Selecione o Dashboard</h3>
        <Select
          defaultValue="analiseTecnica"
          style={{ width: 200 }}
          onChange={(value) => setSelectedDashboard(value)}
        >
          <Option value="analiseTecnica">Análise Técnica</Option>
          <Option value="cobranca">
            Cobrança
            <span 
              className="blinking-dot"
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: getColorForBlockedClients(blockedClientsCount),
                marginLeft: '10px'
              }}
            />
          </Option>
          <Option value="financeiro">Financeiro</Option>
          <Option value="ordensServico">Ordens de Serviço</Option>
        </Select>
      </div>
      <div className="dashboard-content">
        {/* Suspense para exibir um carregador enquanto o dashboard é carregado */}
        <Suspense fallback={<Spin size="large" tip="Carregando dashboard..." />}>
          {renderDashboard()}
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
