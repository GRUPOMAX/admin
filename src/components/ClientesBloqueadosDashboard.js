import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClientesBloqueadosDashboard.css'; // Importe o CSS

const ClientesBloqueadosDashboard = () => {
  const [clientesBloqueados, setClientesBloqueados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientesBloqueados = async () => {
      try {
        const response = await axios.get('/filtered_count');

        // Verifique a resposta
        console.log('Resposta da requisição:', response.data);

        // Acesse o valor numérico
        const count = response.data.count;

        // Verifique o tipo de dado e converta se necessário
        console.log('Tipo de dado de count:', typeof count);
        const countNumber = Number(count);
        console.log('Valor numérico de count:', countNumber);

        setClientesBloqueados(countNumber);
      } catch (error) {
        setError('Erro ao buscar os dados.');
        console.error('Erro ao fazer a requisição:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientesBloqueados();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="clientes-bloqueados-dashboard">
      <h3>Clientes Bloqueados</h3>
      <p>{clientesBloqueados !== null ? clientesBloqueados : 'N/A'}</p>
    </div>
  );
};

export default ClientesBloqueadosDashboard;
