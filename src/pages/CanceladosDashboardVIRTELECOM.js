import React, { useState, useEffect } from 'react';
import { Table, Spin } from 'antd';
import axios from 'axios';

const CanceladosDashboardVIRTELECOM = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://apidoixc.nexusnerds.com.br/Data/clientes_canceladosVIR.json');
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
      key: 'razao_social',
    },
    {
      title: 'CPF/CNPJ',
      dataIndex: 'CPF_CNPJ',
      key: 'cpf_cnpj',
    },
    {
      title: 'ID Contrato',
      dataIndex: 'ID_CONTRATO',
      key: 'id_contrato',
    },
    {
      title: 'Situação do Contrato',
      dataIndex: 'SITUACAO_CONTRATO',
      key: 'situacao_contrato',
    },
    {
      title: 'Data Início',
      dataIndex: 'DATA_INICIO',
      key: 'data_inicio',
    },
    {
      title: 'Dia Vencimento',
      dataIndex: 'DIA_VENCIMENTO',
      key: 'dia_vencimento',
    },
  ];

  return (
    <div>
      <h2>Cancelados VIRTELECOM</h2>
      <p>Total de Contratos Cancelados: {total}</p>
      {loading ? (
        <Spin size="large" tip="Carregando dados..." />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="ID_CONTRATO" />
      )}
    </div>
  );
};

export default CanceladosDashboardVIRTELECOM;
