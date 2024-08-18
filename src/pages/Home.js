import React from 'react';
import ClientesAtivosDashboard from '../components/ClientesAtivosDashboard';
import ClientesBloqueadosDashboard from '../components/ClientesBloqueadosDashboard'; // Importe o novo componente

import './styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <ClientesAtivosDashboard />
      <ClientesBloqueadosDashboard />

      {/* Adicione outros dashboards aqui */}
    </div>
  );
};

export default Home;
