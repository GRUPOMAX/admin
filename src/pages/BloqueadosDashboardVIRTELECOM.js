import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import axios from 'axios';
import './styles/BloqueadosDashboardVIRTELECOM.css';

const BloqueadosDashboardVIRTELECOM = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://apidoixc.nexusnerds.com.br/Data/clientes_bloqueados_atualizado.json');
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
        message.error('Erro ao carregar dados.');
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Número copiado para a área de transferência!');
    }).catch(() => {
      message.error('Falha ao copiar o número.');
    });
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
    {
      title: 'Telefone',
      dataIndex: 'telefone',
      key: 'telefone',
      render: (text) => (
        <span>
          {text} <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(text)} />
        </span>
      ),
    },
  ];

  return (
    <div className="bloqueados-dashboard-container">
      <h2>Dashboard - Bloqueados VIRTELECOM</h2>
      <p>Total de Contratos Bloqueados: {total}</p>
      {loading ? (
        <Spin size="large" tip="Carregando dados..." />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="ID_CONTRATO" />
      )}
    </div>
  );
};

export default BloqueadosDashboardVIRTELECOM;
