// src/components/PopupEquipamentos.js
import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import './Notification.css'; // Importa o CSS para estilizar o componente Notification

const PopupEquipamentos = () => {
  const [losEquipamentos] = useState([]);

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        //const response = await fetch('/.netlify/functions/proxy');
        //const data = await response.json();
        //setLosEquipamentos(data.filter(equipamento => equipamento.status === 'LOS'));
      } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
      }
    };

    fetchEquipamentos();
  }, []);

  return (
    <div>
      <Notification message={losEquipamentos.length > 0 ? 'ONUS OFFLINE' : ''} />
    </div>
  );
};

export default PopupEquipamentos;
