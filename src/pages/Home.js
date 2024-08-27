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

  // Efeito para reiniciar o dashboard automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      // Atualiza a chave de reinicialização, forçando a re-renderização
      setRefreshKey((prevKey) => prevKey + 1);
    }, 60000); // Reinicia a cada 60 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

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
          <Option value="cobranca">Cobrança</Option>
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
