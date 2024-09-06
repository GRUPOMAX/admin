import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import Header from './components/Header';
import EditarPerfil from './components/EditarPerfil';
import CriarUsuario from './pages/CriarUsuario';
import GerenciarAtalhos from './GerenciarAtalhos';
import ConfigScreen from './pages/ConfigScreen';
import SendNotification from './components/SendNotification';
import UsuariosOnline from './components/UsuariosOnline';
import DetalhesDispositivos from './pages/DetalhesDispositivos';
import HomeDashBoard from './pages/HomeDashboard';
import Notes from './components/Notes';
import Tasks from './components/Tasks';
import MonitorVPS from './components/MonitorVPS';
import GalleryPage from './GalleryPage';
import PaginaEmpresas from './components/PaginaEmpresas';
import Fechamento from './pages/fechamento';
import Relatorios from './pages/Relatorios';
import NotificationPopup from './components/NotificationPopup'; // Importar o componente de notificação
import SupremoEnvioNotificacao from './components/SupremoEnvioNotificacao';
import WelcomePopup from './pages/WelcomePopup';





import axios from 'axios';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  // Estado para armazenar notificações no sistema local
  const [notificacoes, setNotificacoes] = useState([]);

  // Função para adicionar notificação ao sistema local
  const adicionarNotificacao = (mensagem) => {
    const novaNotificacao = {
      id: new Date().getTime(),
      mensagem,
      lido: false,
    };

    const updatedNotificacoes = [...notificacoes, novaNotificacao];
    setNotificacoes(updatedNotificacoes);
  };

  const location = useLocation();
  const logoutTimerRef = useRef(null);  // Usar ref para manter controle do temporizador

  // Função de logout
  const handleLogout = async () => {
    console.log("Executando logout...");
    if (userProfile) {
      const now = new Date().toISOString();
      const userData = {
        Id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        nascimento: userProfile.nascimento,
        password: userProfile.password,
        Cargo1: userProfile.Cargo1,
        username: userProfile.username,
        profilePicUrl: userProfile.profilePic,
        isOnline: false,
        lastActiveAt: now,
        empresa: userProfile.empresa
      };

      try {
        await axios.patch(
          'https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records',
          userData,
          {
            headers: {
              'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
            },
          }
        );
        console.log('Status do usuário atualizado para offline.');

        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userProfile');
        navigate('/login');
      } catch (error) {
        console.error('Erro ao atualizar o status online para offline:', error);
      }
    }
  };

  // Função para definir o temporizador de logout automático
  const setupAutoLogout = () => {
    // Limpa qualquer temporizador ativo anterior
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }

    // Define o novo temporizador
    logoutTimerRef.current = setTimeout(() => {
      console.log("Tempo limite atingido. Executando logout...");
      handleLogout(); // Logout após 2 horas de inatividade
    }, 7200000); // 2 horas = 7200000 ms
  };

  // Função para reiniciar o temporizador quando houver atividade do usuário
  const resetLogoutTimer = () => {
    setupAutoLogout(); // Reinicia o temporizador sempre que houver atividade
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Configura o temporizador de logout automático
      setupAutoLogout();

      // Adiciona eventos de atividade do usuário
      window.addEventListener('mousemove', resetLogoutTimer);
      window.addEventListener('keypress', resetLogoutTimer);
      window.addEventListener('click', resetLogoutTimer);
      window.addEventListener('touchstart', resetLogoutTimer);

      return () => {
        // Limpa o temporizador e remove os listeners de eventos quando o componente desmontar
        clearTimeout(logoutTimerRef.current);
        window.removeEventListener('mousemove', resetLogoutTimer);
        window.removeEventListener('keypress', resetLogoutTimer);
        window.removeEventListener('click', resetLogoutTimer);
        window.removeEventListener('touchstart', resetLogoutTimer);
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const isLoginPage = location.pathname === '/' || location.pathname === '/login';
    if (isLoginPage) {
      document.body.classList.add('login-background');
    } else {
      document.body.classList.remove('login-background');
    }
  }, [location]);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    const userProfileData = { ...userData, name: userData.name || userData.username };
    setUserProfile(userProfileData);
    localStorage.setItem('userProfile', JSON.stringify(userProfileData));
  };

  const handleProfileUpdate = (updatedProfile) => {
    const updatedData = { ...userProfile, ...updatedProfile, name: updatedProfile.name || updatedProfile.username };
    setUserProfile(updatedData);
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
  };

  return (
    <div className={`App ${location.pathname === '/cadastro' ? 'cadastro-page' : ''}`}>
      {isAuthenticated && userProfile && <Header userProfile={userProfile} onLogout={handleLogout} />}
      
      <Routes>
        {isAuthenticated && userProfile ? (
          <>
            <Route
              path="/home/*"
              element={
                <SidebarLayout
                  onLogout={handleLogout}
                  userProfile={userProfile}
                  onProfileUpdate={handleProfileUpdate}
                  adicionarNotificacao={adicionarNotificacao} // Passando a função adicionarNotificacao para o SidebarLayout
                  notificacoes={notificacoes}
                  setNotificacoes={setNotificacoes}
                />
              }
            />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        ) : (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </div>
  );
};



const SidebarLayout = ({ onLogout, userProfile, onProfileUpdate }) => (
  <>
    <Sidebar onLogout={onLogout} userName={userProfile.name} /> {/* Aqui passamos o userName */}
    
    <NotificationPopup userId={userProfile.id} /> {/* Adicionamos o NotificationPopup aqui */}
    <WelcomePopup userProfile={userProfile} />
    <div className="layout-container">
      <Routes>
        <Route path="/" element={<Home userProfile={userProfile}/>} />
        <Route path="/detalhes-dispositivos" element={<DetalhesDispositivos userProfile={userProfile}/>} />
        <Route path="/max-fibra" element={<MaxFibra userProfile={userProfile} />} />
        <Route path="/consultaCNPJ" element={<ConsultaCnpj />} />
        <Route path="/vir-telecom/consultaCNPJ" element={<ConsultaCnpj />} />
        <Route path="/vir-telecom" element={<VirTelecom userProfile={userProfile}/>} />
        <Route path="/reis-services" element={<ReisServices userProfile={userProfile}/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/max-fibra/cadastro" element={<Cadastro />} />
        <Route path="/criar-usuario" element={<CriarUsuario />} />
        <Route path="/editar-perfil" element={<EditarPerfil userProfile={userProfile} onProfileUpdate={onProfileUpdate} />} />
        <Route path="/gerenciar-atalhos" element={<GerenciarAtalhos userProfile={userProfile} />} />
        <Route path="/config" element={<ConfigScreen userProfile={userProfile} />} />
        <Route path="/send-notification" element={<SendNotification userProfile={userProfile} />} />
        <Route path="/usuarios-online" element={<UsuariosOnline userProfile={userProfile}/>} />
        <Route path="/vir-telecom/Dashboard-virtelecom" element={<HomeDashBoard userProfile={userProfile}/>} />
        <Route path="/notas" element={<Notes userProfile={userProfile}/>} />
        <Route path="/tarefas" element={<Tasks userProfile={userProfile}/>} />
        <Route path="/monitor-vps" element={<MonitorVPS userProfile={userProfile}/>} />
        <Route path="/galeria" element={<GalleryPage userProfile={userProfile}/>} />
        <Route path="/relatorio-fechamento" element={<Relatorios userProfile={userProfile}/>} />
        <Route path="/reis-services/fechamento" element={<Fechamento userProfile={userProfile}/>} />
        <Route path="/paginaEmpresa" element={<PaginaEmpresas userProfile={userProfile}/>} />
        <Route path="/EnvioSupremo" element={<SupremoEnvioNotificacao userProfile={userProfile}/>} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  </>
);

const Root = () => (
  <Router basename="/">
    <App />
  </Router>
);

export default Root;
