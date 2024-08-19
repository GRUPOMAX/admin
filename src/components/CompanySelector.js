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
        <option value="/area_administrativa/max-fibra">Max Fibra</option>
        <option value="/area_administrativa/vir-telecom">Vir Telecom</option>
        <option value="/area_administrativa/reis-services">Reis Service</option>
      </select>
    </div>
  );
};

export default CompanySelector;
