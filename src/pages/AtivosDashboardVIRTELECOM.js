import React, { useEffect, useState } from 'react';
import { Table, Spin, message } from 'antd';
import axios from 'axios';
import './styles/AtivosDashboardVIRTELECOM.css';

const AtivosDashboardVIRTELECOM = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://apidoixc.nexusnerds.com.br/Data/clientes_ativosVIR.json');
        const clientes = response.data.clientes.map(cliente => ({
          ...cliente,
          SITUACAO_CONTRATO: mapSituacao(cliente.SITUACAO_CONTRATO),
        }));
        setData(clientes);
        setTotal(clientes.length); // Define o total de contratos
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mapSituacao = (situacao) => {
    switch (situacao) {
      case 'A':
        return 'Ativo';
      case 'C':
        return 'Cancelado';
      case 'B':
        return 'Bloqueado';
      case 'I':
        return 'Inativo';
      default:
        return situacao;
    }
  };

  const columns = [
    {
      title: 'Razão Social',
      dataIndex: 'RAZAO_SOCIAL',
      key: 'RAZAO_SOCIAL',
    },
    {
      title: 'CPF/CNPJ',
      dataIndex: 'CPF_CNPJ',
      key: 'CPF_CNPJ',
    },
    {
      title: 'ID Contrato',
      dataIndex: 'ID_CONTRATO',
      key: 'ID_CONTRATO',
    },
    {
      title: 'Situação do Contrato',
      dataIndex: 'SITUACAO_CONTRATO',
      key: 'SITUACAO_CONTRATO',
    },
    {
      title: 'Data Início',
      dataIndex: 'DATA_INICIO',
      key: 'DATA_INICIO',
    },
    {
      title: 'Dia Vencimento',
      dataIndex: 'DIA_VENCIMENTO',
      key: 'DIA_VENCIMENTO',
    },
  ];

  return (
    <div className="ativos-dashboard-container">
      <h2>Dashboard - Ativos VIRTELECOM</h2>
      <p>Total de Contratos Ativos: {total}</p>
      {loading ? (
        <Spin size="large" tip="Carregando dados..." />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="ID_CONTRATO" />
      )}
    </div>
  );
};

export default AtivosDashboardVIRTELECOM;
