import React, { useEffect, useState } from 'react';
import './NotificationBadge.css';

const NotificationBadge = () => {
  const [losCount, setLosCount] = useState(0);

  useEffect(() => {
    // Função para buscar a quantidade de LOS
    const fetchLosCount = async () => {
      try {
        const response = await fetch('/.netlify/functions/proxy');
        const data = await response.json();
        // Supondo que a resposta da API tenha a contagem de LOS
        const count = data.filter(equip => equip.status === 'LOS').length;
        setLosCount(count);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    // Chama a função ao montar o componente
    fetchLosCount();
  }, []);

  return (
    <div className="notification-badge">
      <div className="badge">{losCount}</div>
      <span className="label">LOS</span>
    </div>
  );
};

export default NotificationBadge;
