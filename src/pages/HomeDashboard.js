import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Select, Spin } from 'antd';
import './styles/HomeDashboard.css'; // Importando o CSS separado

const { Option } = Select;

// Usando React.lazy para carregar os dashboards sob demanda
const CanceladosDashboardVIRTELECOM = React.lazy(() => import('./CanceladosDashboardVIRTELECOM'));
const AtivosDashboardVIRTELECOM = React.lazy(() => import('./AtivosDashboardVIRTELECOM'));
const BloqueadosDashboardVIRTELECOM = React.lazy(() => import('./BloqueadosDashboardVIRTELECOM'));
const InativosDashboardVIRTELECOM = React.lazy(() => import('./InativosDashboardVIRTELECOM'));

const HomeDashboard = () => {
  const [selectedDashboard, setSelectedDashboard] = useState('canceladosVIRTELECOM');
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
      case 'canceladosVIRTELECOM':
        return <CanceladosDashboardVIRTELECOM key={refreshKey} />;
      case 'ativosVIRTELECOM':
        return <AtivosDashboardVIRTELECOM key={refreshKey} />;
      case 'bloqueadosVIRTELECOM':
        return <BloqueadosDashboardVIRTELECOM key={refreshKey} />;
      case 'inativosVIRTELECOM':
        return <InativosDashboardVIRTELECOM key={refreshKey} />;
      default:
        return <CanceladosDashboardVIRTELECOM key={refreshKey} />;
    }
  }, [selectedDashboard, refreshKey]);

  return (
    <div className="dashboard-container-Virtelecom">
      <div className="dashboard-selector">
        <h3>Selecione o Dashboard</h3>
        <Select
          defaultValue="canceladosVIRTELECOM"
          style={{ width: 200 }}
          onChange={(value) => setSelectedDashboard(value)}
        >

          <Option value="ativosVIRTELECOM">Ativos</Option>
          <Option value="bloqueadosVIRTELECOM">Bloqueados</Option>
          <Option value="canceladosVIRTELECOM">Cancelados</Option>
          <Option value="inativosVIRTELECOM">Inativos</Option>
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

export default HomeDashboard;
