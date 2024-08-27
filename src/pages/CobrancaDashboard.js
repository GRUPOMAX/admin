import React, { useEffect, useState } from 'react';
import { Input, Pagination } from 'antd';
import './styles/CobrancaDashboard.css';

const { Search } = Input;
console.log(`Largura: ${window.innerWidth}px, Altura: ${window.innerHeight}px`);

const CobrancaDashboard = React.memo(() => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15); // Define 15 itens por página

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://apidoixc.nexusnerds.com.br/Data/ClientesBloquados.json');
        const data = await response.json();
        setClientes(data);
        setFilteredClientes(data); // Inicialmente, a lista filtrada é a mesma que a original
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    // Filtra os clientes com base no termo de busca
    const filtered = clientes.filter((cliente) =>
      cliente.razao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.endereco.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClientes(filtered);
    setCurrentPage(1); // Reseta para a primeira página ao buscar
  }, [searchTerm, clientes]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calcula o índice inicial e final dos clientes que devem ser exibidos na página atual
  const indexOfLastCliente = currentPage * pageSize;
  const indexOfFirstCliente = indexOfLastCliente - pageSize;
  const currentClientes = filteredClientes.slice(indexOfFirstCliente, indexOfLastCliente);

  useEffect(() => {
    const handlePrintShortcut = (e) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.print(); // Força a impressão
      }
    };

    window.addEventListener('keydown', handlePrintShortcut);

    return () => {
      window.removeEventListener('keydown', handlePrintShortcut);
    };
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="cobranca-dashboard-container">
      <h2>Clientes Bloqueados</h2>
      <Search
        className="custom-search"
        placeholder="Buscar por nome ou endereço..."
        onChange={(e) => setSearchTerm(e.target.value)}
        enterButton
      />
      <p>Total de clientes bloqueados: {filteredClientes.length}</p>
      <table className="clientes-table">
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Razão Social</th>
            <th>Endereço</th>
            <th>Telefone Celular</th>
            <th>Telefone Comercial</th>
          </tr>
        </thead>
        <tbody>
          {currentClientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.id_cliente}</td>
              <td>{cliente.razao}</td>
              <td>{cliente.endereco}</td>
              <td>{cliente.telefone_celular}</td>
              <td>{cliente.telefone_comercial || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        current={currentPage}
        total={filteredClientes.length}
        pageSize={pageSize}
        onChange={handlePageChange}
        style={{ marginTop: 20, textAlign: 'center' }}
      />
    </div>
  );
});

export default CobrancaDashboard;
