// src/components/CompanySelector.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CompanySelector.css'; // Importe o arquivo CSS

const CompanySelector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtenha o caminho atual
  const currentPath = location.pathname;

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    navigate(selectedValue);
  };

  return (
    <div className="company-selector">
      <select onChange={handleChange} value={currentPath}>
<<<<<<< HEAD
        <option value="/home/max-fibra">Max Fibra</option>
        <option value="/home/vir-telecom">Vir Telecom</option>
        <option value="/home/reis-services">Reis Service</option>
=======
        <option value="/max-fibra">Max Fibra</option>
        <option value="/vir-telecom">Vir Telecom</option>
        <option value="/reis-services">Reis Service</option>
>>>>>>> 12857f8 (ajustes de tela de login e reload)
      </select>
    </div>
  );
};

export default CompanySelector;
