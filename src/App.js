import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import MaxFibra from './pages/MaxFibra';
import CompanySelector from './components/CompanySelector';
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
import DetalhesDispositivos from './pages/DetalhesDispositivos'; // Importe a nova página
import HomeDashBoard from './pages/HomeDashboard';
import Notes from './components/Notes';
import Tasks from './components/Tasks';
import MonitorVPS from './components/MonitorVPS';
import GalleryPage from './GalleryPage';
import PaginaEmpresas from './components/PaginaEmpresas';



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

  const location = useLocation();

  

  useEffect(() => {
    const isLoginPage = location.pathname === '/' || location.pathname === '/login';
    if (isLoginPage) {
      document.body.classList.add('login-background');
    } else {
      document.body.classList.remove('login-background');
    }
  }, [location]);

  useEffect(() => {
    const checkTimers = () => {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const now = new Date().getTime();
      tasks.forEach(task => {
        if (task.timerEnd) {
          const timeRemaining = task.timerEnd - now;
          if (timeRemaining <= 0) {
            // Toca o alarme
            const audio = new Audio('/alert.mp3');
            audio.play();
            // Atualiza o localStorage para remover o timer concluído
            task.timerEnd = null;
          }
        }
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const interval = setInterval(checkTimers, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const updateOnlineStatus = async (isOnline) => {
    if (userProfile) {
      const now = new Date().toISOString();
      const userData = {
        name: userProfile.name,
        email: userProfile.email,
        password: userProfile.password,
        Cargo1: userProfile.Cargo1,
        username: userProfile.username,
        profilePicUrl: userProfile.profilePic,
        isOnline: isOnline,
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
        console.log('Status do usuário atualizado:', isOnline ? 'Online' : 'Offline');
      } catch (error) {
        console.error('Erro ao atualizar o status online:', error);
      }
    }
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    const userProfileData = { ...userData, name: userData.name || userData.username };
    setUserProfile(userProfileData);
    localStorage.setItem('userProfile', JSON.stringify(userProfileData));
    updateOnlineStatus(true); // Atualiza para "online" quando o usuário fizer login
  };

  const handleLogout = async () => {
    if (userProfile) {
      const now = new Date().toISOString();
      const userData = {
        Id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
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
                />
              }
            />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        ) : (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>

      <div className="mobile-warning">
        <img src="https://i.ibb.co/g9KDtqK/warning.png" alt="Aviso" />
        <p>O aplicativo está disponível apenas para desktop.</p>
      </div>
    </div>
  ); 
};

const SidebarLayout = ({ onLogout, userProfile, onProfileUpdate }) => (
  <>
    <Sidebar onLogout={onLogout} />
    <div className="layout-container">
      <Routes>
        <Route path="/" element={<Home  userProfile={userProfile}/>} />
        <Route path="/detalhes-dispositivos" element={<DetalhesDispositivos userProfile={userProfile}/>} /> {/* Nova rota */}
        <Route path="/max-fibra" element={<MaxFibra userProfile={userProfile} />} />
        <Route path="/max-fibra/consultaCPF" element={<ConsultaCpf />} />
        <Route path="/max-fibra/consultaCNPJ" element={<ConsultaCnpj />} />
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
        <Route path="/paginaEmpresa" element={<PaginaEmpresas userProfile={userProfile}/>} />



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
