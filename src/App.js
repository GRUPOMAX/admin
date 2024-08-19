import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MaxFibra from './pages/MaxFibra';
import VirTelecom from './pages/VirTelecom';
import ReisServices from './pages/ReisServices';
import Contact from './pages/Contact';
import Cadastro from './pages/Cadastro'; // Importar a página de Cadastro
import Sidebar from './components/Sidebar';
import ConsultaCpf from './pages/ConsultaCpf';
import ConsultaCnpj from './pages/ConsultaCnpj';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router basename="/area_administrativa">
      <div className={`App ${window.location.pathname === '/cadastro' ? 'cadastro-page' : ''}`}>
        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          ) : (
            <>
              <Route path="/area_administrativa/*" element={<SidebarLayout />} />
              <Route path="*" element={<Navigate to="/area_administrativa/home" replace />} />
            </>
          )}
        </Routes>
        {/* Tela de aviso para dispositivos móveis */}
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
        <Route path="/home" element={<Home />} />
        <Route path="/max-fibra" element={<MaxFibra />} />
        <Route path="/max-fibra/consultaCPF" element={<ConsultaCpf />} />
        <Route path="/max-fibra/consultaCNPJ" element={<ConsultaCnpj />} />
        <Route path="/vir-telecom" element={<VirTelecom />} />
        <Route path="/reis-services" element={<ReisServices />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/max-fibra/cadastro" element={<Cadastro />} /> {/* Adicionar rota de Cadastro */}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  </>
);

export default App;
