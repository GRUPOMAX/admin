import React, { useEffect, useState } from 'react';
import { Input, Pagination, Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import './styles/CobrancaDashboard.css';

const { Search } = Input;

const CobrancaDashboard = React.memo(() => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Define 10 itens por página

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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Número copiado para a área de transferência!');
    }).catch(() => {
      message.error('Falha ao copiar o número.');
    });
  };

  const getColorForBlockedClients = (total) => {
    if (total > 50) {
      return 'red';
    } else if (total > 20) {
      return 'orange';
    } else {
      return 'green';
    }
  };

  const totalBlocked = filteredClientes.length;

  // Calcula o índice inicial e final dos clientes que devem ser exibidos na página atual
  const indexOfLastCliente = currentPage * pageSize;
  const indexOfFirstCliente = indexOfLastCliente - pageSize;
  const currentClientes = filteredClientes.slice(indexOfFirstCliente, indexOfLastCliente);

  const exportToExcel = () => {
    // Criando uma nova lista de clientes sem a propriedade "endereco"
    const clientesSemEndereco = filteredClientes.map(({ endereco, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(clientesSemEndereco);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes Bloqueados");
    XLSX.writeFile(workbook, "clientes_bloqueados.xlsx");
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="cobranca-dashboard-custom-container">
      <h2>Clientes Bloqueados</h2>
      <Search
        className="custom-search"
        placeholder="Buscar por nome ou endereço..."
        onChange={(e) => setSearchTerm(e.target.value)}
        enterButton
      />
      <p>Total de clientes bloqueados: {totalBlocked} 
        <span 
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: getColorForBlockedClients(totalBlocked),
            marginLeft: '10px'
          }}
        />
      </p>
      <table className="clientes-table-custom">
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>Razão Social</th>
            <th>Telefone Celular</th>
            <th>Telefone Comercial</th>
          </tr>
        </thead>
        <tbody>
          {currentClientes.map((cliente) => (
            <tr key={cliente.id_cliente}>
              <td>{cliente.id_cliente}</td>
              <td>{cliente.razao}</td>
              <td>
                {cliente.telefone_celular}{' '}
                <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(cliente.telefone_celular)} />
              </td>
              <td>
                {cliente.telefone_comercial || 'SEM CONTATO'}{' '}
                {cliente.telefone_comercial && (
                  <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(cliente.telefone_comercial)} />
                )}
              </td>
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

      <Button type="primary" onClick={exportToExcel} className="button-download-custom">
        Baixar Excel
      </Button>
    </div>
  );
});

export default CobrancaDashboard;
