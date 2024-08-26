<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
=======
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
>>>>>>> 12857f8 (ajustes de tela de login e reload)
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
import CriarUsuario from './pages/CriarUsuario'; // Importe o componente de criação de usuário
import GerenciarAtalhos from './GerenciarAtalhos';
import ConfigScreen from './pages/ConfigScreen';
import SendNotification from './components/SendNotification';




import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

<<<<<<< HEAD
  const [userProfile, setUserProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const location = useLocation();

  useEffect(() => {
=======
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se a rota atual é a tela de login
>>>>>>> 12857f8 (ajustes de tela de login e reload)
    const isLoginPage = location.pathname === '/' || location.pathname === '/login';
    if (isLoginPage) {
      document.body.classList.add('login-background');
    } else {
      document.body.classList.remove('login-background');
    }
  }, [location]);

<<<<<<< HEAD
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  
    // Capturando e salvando o campo "name" corretamente
    const userProfileData = { ...userData, name: userData.name || userData.username };
    setUserProfile(userProfileData);
    localStorage.setItem('userProfile', JSON.stringify(userProfileData));
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userProfile');
    setUserProfile(null);
    window.location.href = '/admin/#/login';
  };

  const handleProfileUpdate = (updatedProfile) => {
    // Garantindo que "name" seja salvo corretamente após a atualização
    const updatedData = { ...userProfile, ...updatedProfile, name: updatedProfile.name || updatedProfile.username };
    setUserProfile(updatedData);
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
  };
  

  return (
    <div className={`App ${location.pathname === '/cadastro' ? 'cadastro-page' : ''}`}>
      {isAuthenticated && userProfile && <Header userProfile={userProfile} onLogout={handleLogout} />}
      <Routes>
        {!isAuthenticated ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          <>
            <Route
              path="/home/*"
              element={
                <SidebarLayout
                  onLogout={handleLogout}
                  userProfile={userProfile}
                  onProfileUpdate={handleProfileUpdate} // Passando a função correta aqui
                />
              }
            />
=======
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    // Redireciona para /home após o login bem-sucedido
    navigate('/home', { replace: true });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    // Redireciona para a tela de login
    navigate('/login', { replace: true });
  };

  return (
    <div className={`App ${location.pathname === '/cadastro' ? 'cadastro-page' : ''}`}>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/home/*" element={<SidebarLayout onLogout={handleLogout} />} />
>>>>>>> 12857f8 (ajustes de tela de login e reload)
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
      <div className="mobile-warning">
        <img src="https://i.ibb.co/g9KDtqK/warning.png" alt="Aviso" />
        <p>O aplicativo está disponível apenas para desktop.</p>
      </div>
    </div>
  );
};

<<<<<<< HEAD
const SidebarLayout = ({ onLogout, userProfile, onProfileUpdate }) => (
  <>
    <Sidebar onLogout={onLogout} />
    <div className="layout-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/max-fibra" element={<MaxFibra userProfile={userProfile} />} />
        <Route path="/max-fibra/consultaCPF" element={<ConsultaCpf />} />
        <Route path="/max-fibra/consultaCNPJ" element={<ConsultaCnpj />} />
        <Route path="/vir-telecom" element={<VirTelecom userProfile={userProfile}/>} />
        <Route path="/reis-services" element={<ReisServices userProfile={userProfile}/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/max-fibra/cadastro" element={<Cadastro />} />
        <Route path="/criar-usuario" element={<CriarUsuario />} /> {/* Adicione esta linha */}
        <Route path="/editar-perfil" element={<EditarPerfil userProfile={userProfile} onProfileUpdate={onProfileUpdate} />} />
        <Route path="/gerenciar-atalhos" element={<GerenciarAtalhos userProfile={userProfile} />} />
        <Route path="/config" element={<ConfigScreen userProfile={userProfile} />} />
        <Route path="/send-notification" element={<SendNotification userProfile={userProfile} />} />
=======
const SidebarLayout = ({ onLogout }) => (
  <>
    <Sidebar onLogout={onLogout} />
    <div className="content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/max-fibra" element={<MaxFibra />} />
        <Route path="/max-fibra/consultaCPF" element={<ConsultaCpf />} />
        <Route path="/max-fibra/consultaCNPJ" element={<ConsultaCnpj />} />
        <Route path="/home/vir-telecom" element={<VirTelecom />} />
        <Route path="/home/reis-services" element={<ReisServices />} />
        <Route path="/home/contact" element={<Contact />} />
        <Route path="/max-fibra/cadastro" element={<Cadastro />} />
>>>>>>> 12857f8 (ajustes de tela de login e reload)
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
