import React from 'react';
import { Row, Col } from 'antd';
import ClientesAtivosDashboard from '../components/ClientesAtivosDashboard';
import ClientesBloqueadosDashboard from '../components/ClientesBloqueadosDashboard';
import DistBairros from '../components/DistBairros';
import './styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div className="dashboard-container">
            <ClientesAtivosDashboard />
          </div>
        </Col>
        <Col span={12}>
          <div className="dashboard-container">
            <ClientesBloqueadosDashboard />
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className="dist-bairros-container">
            <DistBairros />
          </div>
        </Col>
      </Row>
    </div>
  );
};


export default Home;
