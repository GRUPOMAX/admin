// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MaxFibra from './pages/MaxFibra';
import VirTelecom from './pages/VirTelecom';
import ReisServices from './pages/ReisServices';
import Contact from './pages/Contact';
import Sidebar from './components/Sidebar';
import ConsultaCpf from './pages/ConsultaCpf';
import ConsultaCnpj from './pages/ConsultaCnpj';
import Login from './pages/Login';
import Home from './pages/Home';  // Importe a nova página Home
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          ) : (
            <>
              <Route path="/area_administrativa/*" element={<SidebarLayout />} />
              <Route path="*" element={<Navigate to="/area_administrativa/home" replace />} /> {/* Ajuste aqui */}
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

const SidebarLayout = () => (
  <>
    <Sidebar />
    <div className="content">
      <Routes>
        <Route path="/home" element={<Home />} /> {/* Adicione a rota para Home */}
        <Route path="/max-fibra" element={<MaxFibra />} />
        <Route path="/max-fibra/consultaCPF" element={<ConsultaCpf />} />
        <Route path="/max-fibra/consultaCNPJ" element={<ConsultaCnpj />} />
        <Route path="/vir-telecom" element={<VirTelecom />} />
        <Route path="/reis-services" element={<ReisServices />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Navigate to="/area_administrativa/home" replace />} /> {/* Redireciona para Home */}
      </Routes>
    </div>
  </>
);

export default App;
