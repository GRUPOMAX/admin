import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import './WelcomePopup.css';  // Para personalizar o estilo

const WelcomePopup = ({ userProfile }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // Controle da página atual

  useEffect(() => {
    const isNewUser = localStorage.getItem('isNewUser');

    if (userProfile && !isNewUser) {
      setIsModalVisible(true);
      localStorage.setItem('isNewUser', 'true');
    }
  }, [userProfile]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Bem-vindo!"
      visible={isModalVisible}
      footer={null}
      closable={false}  // Impede o fechamento manual
    >
      {currentPage === 1 && (
        <div className="welcome-page">
          <h2>Bem-vindo, {userProfile?.name}!</h2>
          <p>Estamos muito felizes em tê-lo(a) no nosso sistema.</p>
          <p>Aqui você encontrará tudo o que precisa para começar!</p>
          <Button type="primary" onClick={handleNextPage} style={{ marginTop: '20px' }}>
            Próximo
          </Button>
        </div>
      )}

      {currentPage === 2 && (
        <div className="welcome-page">
          <h2>Privilégios Exclusivos</h2>
          <p><strong>Sistema de Notas Pessoal:</strong> Adicione notas ou lembretes pessoais para não perder compromissos importantes.</p>
          <p><strong>Sistema de Atalho Pessoal:</strong> Crie atalhos personalizados para acessar rapidamente as ferramentas e páginas que você mais usa.</p>
          <p><strong>Sistema de Multi-Atalhos:</strong> Abra várias páginas ao mesmo tempo, facilitando o gerenciamento de várias tarefas.</p>
          <p><strong>Sistema de Tarefas:</strong> Adicione e gerencie tarefas específicas para manter o foco nas atividades importantes.</p>

          <Button onClick={handleNextPage} style={{ marginTop: '20px' }}>Próximo</Button>
          <Button onClick={handlePreviousPage} style={{ marginLeft: '10px' }}>Voltar</Button>
        </div>
      )}

      {currentPage === 3 && (
        <div className="welcome-page">
          <h2>Empresas e Páginas Específicas</h2>
          <p>Cada usuário está vinculado a uma empresa específica, e cada empresa tem suas próprias características e páginas personalizadas.</p>
          <p>Certifique-se de explorar todas as funcionalidades exclusivas oferecidas para sua empresa.</p>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handlePreviousPage}>Voltar</Button>
            <Button type="primary" onClick={handleClose}>Entendido</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default WelcomePopup;
