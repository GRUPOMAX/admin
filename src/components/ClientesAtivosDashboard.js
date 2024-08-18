import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientesAtivosDashboard.css'; // Importe o CSS

const ClientesAtivosDashboard = () => {
  const [clientesAtivos, setClientesAtivos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientesAtivos = async () => {
      try {
        const response = await axios.get('/clientesAtivos'); // URL relativa
        // Ajusta o total conforme necessário
        const totalAjustado = response.data.total - 514;
        setClientesAtivos(totalAjustado);
      } catch (error) {
        setError('Erro ao buscar os dados.');
        console.error('Erro ao fazer a requisição:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientesAtivos();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="clientes-ativos-dashboard">
      <h3>Clientes Ativos</h3>
      <p>{clientesAtivos}</p>
    </div>
  );
};

export default ClientesAtivosDashboard;
