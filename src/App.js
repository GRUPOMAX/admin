import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MaxFibra from './pages/MaxFibra';
import VirTelecom from './pages/VirTelecom';
import ReisServices from './pages/ReisServices';
import Contact from './pages/Contact';
import Cadastro from './pages/Cadastro';
import Sidebar from './components/Sidebar';
import ConsultaCpf from './pages/ConsultaCpf';
import ConsultaCnpj from './pages/ConsultaCnpj';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router basename="/">
      <div className={`App ${window.location.pathname === '/cadastro' ? 'cadastro-page' : ''}`}>
        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          ) : (
            <>
              <Route path="/home/*" element={<SidebarLayout />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </>
          )}
        </Routes>
        <div className="mobile-warning">
          <img src="https://i.ibb.co/g9KDtqK/warning.png" alt="Aviso" />
          <p>O aplicativo está disponível apenas para desktop.</p>
        </div>
      </div>
    </Router>
  );
};

const SidebarLayout = () => (
  <>
    <Sidebar />
    <div className="content">
      <Routes>
        <Route path="/" element={<Home />} /> {/* Corrigido para "/home" */}
        <Route path="/max-fibra" element={<MaxFibra />} />
        <Route path="/max-fibra/consultaCPF" element={<ConsultaCpf />} />
        <Route path="/max-fibra/consultaCNPJ" element={<ConsultaCnpj />} />
        <Route path="/vir-telecom" element={<VirTelecom />} />
        <Route path="/reis-services" element={<ReisServices />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/max-fibra/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  </>
);

export default App;
