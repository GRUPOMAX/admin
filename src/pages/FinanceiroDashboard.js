import React, { useEffect, useState } from 'react';
import { Table, Select, message, Spin, Button } from 'antd';
import axios from 'axios';
import './styles/FinanceiroDashboard.css';

const { Option } = Select;

const FinanceiroDashboard = () => {
  const [clientes, setClientes] = useState([]);
  const [numeroDeClientesAtivos, setNumeroDeClientesAtivos] = useState(0);
  const [meses, setMeses] = useState([]);
  const [selectedMes, setSelectedMes] = useState('');
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

  const columns = [
    {
      title: 'Nome do Cliente',
      dataIndex: 'nome_cliente',
      key: 'nome_cliente',
    },
    {
      title: 'Data de Ativação',
      dataIndex: 'data_ativacao',
      key: 'data_ativacao',
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
        >
          <Option value="">Todos os meses</Option>
          {meses.map(mes => (
            <Option key={mes} value={mes}>
              {mes}
            </Option>
          ))}
        </Select>
      </div>
      {loading ? (
        <Spin size="large" tip="Carregando dados..." />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredClientes}
          rowKey="nome_cliente"
          pagination={{ pageSize: 10 }}
        />
      )}
      <Button
        type="primary"
        onClick={() => window.location.reload()}
        style={{ marginTop: 20 }}
      >
        Atualizar Dados
      </Button>
    </div>
  );
};

export default FinanceiroDashboard;
