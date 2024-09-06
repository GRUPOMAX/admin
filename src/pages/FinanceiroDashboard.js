import React, { useEffect, useState } from 'react';
import { Table, Select, message, Spin, Button } from 'antd';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './styles/FinanceiroDashboard.css';

const { Option } = Select;

const FinanceiroDashboard = () => {
  const [clientes, setClientes] = useState([]);
  const [numeroDeClientesAtivos, setNumeroDeClientesAtivos] = useState(0);
  const [meses, setMeses] = useState([]);
  const [selectedMes, setSelectedMes] = useState('Neste Mês'); // Preseleciona "Neste Mês"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar dados dos clientes
        const clientesData = await axios.get('https://apidoixc.nexusnerds.com.br/Data/Mês_AtivaçãoCliente.json');
        const resultadoData = await axios.get('https://apidoixc.nexusnerds.com.br/Data/resultado.json');

        setClientes(clientesData.data.clientes);
        setNumeroDeClientesAtivos(resultadoData.data.numeroDeClientesAtivos);

        // Extrair os meses únicos para o filtro
        const uniqueMeses = [...new Set(clientesData.data.clientes.map(cliente => cliente.mes_ativacao))];
        setMeses(uniqueMeses);

        setLoading(false);
      } catch (error) {
        message.error('Erro ao carregar os dados do dashboard financeiro.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função para exportar a tabela filtrada para XLSX
  const exportToXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(filteredClientes); // Converte apenas os clientes filtrados para um sheet
    const wb = XLSX.utils.book_new(); // Cria um novo workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes Filtrados'); // Adiciona o sheet ao workbook

    // Converte o workbook para um arquivo binário e inicia o download
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `clientes_${selectedMes || 'todos_os_meses'}.xlsx`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const columns = [
    {
      title: 'Nome do Cliente',
      dataIndex: 'nome_cliente',
      key: 'nome_cliente',
      render: (text, record) => (
        <span style={{ color: record.bloqueado === 'Sim' ? 'red' : 'inherit' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Data de Ativação',
      dataIndex: 'data_ativacao',
      key: 'data_ativacao',
      render: (text, record) => (
        <span style={{ color: record.bloqueado === 'Sim' ? 'red' : 'inherit' }}>
          {formatDate(text)}
        </span>
      ),
    },
    {
      title: 'Mês de Ativação',
      dataIndex: 'mes_ativacao',
      key: 'mes_ativacao',
    },
    {
      title: 'Bloqueado',
      dataIndex: 'bloqueado',
      key: 'bloqueado',
      render: (text) => (
        <span style={{ color: text === 'Sim' ? 'red' : 'inherit' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Vendedor Responsável',
      dataIndex: 'vendedor_responsavel',
      key: 'vendedor_responsavel',
      render: (text, record) => (
        <span style={{ color: record.bloqueado === 'Sim' ? 'red' : 'inherit' }}>
          {text}
        </span>
      ),
    },
  ];

  // Filtra os clientes com base no mês selecionado
  const filteredClientes = clientes.filter(cliente => 
    selectedMes ? cliente.mes_ativacao === selectedMes : true
  );

  // Conta o número de ativações no mês selecionado ou em todos os meses
  const quantidadeAtivacoes = filteredClientes.length;

  return (
    <div className="financeiro-dashboard-container">
      <h2>Dashboard Financeiro</h2>
      <div className="info-container">
        <p>Total de Clientes Ativos: {numeroDeClientesAtivos}</p>
        <p>
          {selectedMes 
            ? `Ativações em ${selectedMes}: ${quantidadeAtivacoes}`
            : `Ativações Totais: ${quantidadeAtivacoes}`}
        </p>
      </div>
      <div className="filter-container">
        <Select
          placeholder="Filtrar por mês de ativação"
          onChange={(value) => setSelectedMes(value)}
          style={{ width: 200, marginBottom: 20 }}
          value={selectedMes} // Pre-seleciona "Neste Mês"
        >
          <Option value="">Todos os meses</Option>
          <Option value="Mês Passado">Mês Passado</Option>
          <Option value="Neste Mês">Neste Mês</Option>
        </Select>
      </div>
      {loading ? (
        <Spin size="large" tip="Carregando dados..." />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={filteredClientes}
            rowKey="nome_cliente"
            pagination={{ pageSize: 10 }}
          />
          <Button
            type="primary"
            onClick={exportToXLSX}
            style={{ marginTop: 20 }}
          >
            Baixar XLSX
          </Button>
        </>
      )}
    </div>
  );
};

export default FinanceiroDashboard;
