import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Button } from 'antd';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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

  // Função para exportar os dados para XLSX
  const exportToXLSX = () => {
    // Filtrar campos indesejados e adicionar a "Razão Social"
    const filteredData = data.map(({ RAZAO_SOCIAL, CPF_CNPJ, ID_CONTRATO, SITUACAO_CONTRATO, DATA_INICIO, DIA_VENCIMENTO, telefone }) => ({
      'Razão Social': RAZAO_SOCIAL, // Inclui a coluna "Razão Social"
      'CPF/CNPJ': CPF_CNPJ,
      'Telefone': telefone,
    }));

    // Criar a planilha Excel
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    
    // Adicionar o título "Bloqueados VIR TELECOM"
    XLSX.utils.sheet_add_aoa(ws, [['Bloqueados VIR TELECOM']], { origin: 'A1' });

    // Mover os dados abaixo do título
    XLSX.utils.sheet_add_json(ws, filteredData, { origin: 'A2', skipHeader: true });

    XLSX.utils.book_append_sheet(wb, ws, 'Bloqueados');

    // Gerar o arquivo Excel e o baixar
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, 'bloqueados.xlsx');
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
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
      <Button type="primary" icon={<DownloadOutlined />} onClick={exportToXLSX}>
        Baixar XLSX
      </Button>
      {loading ? (
        <Spin size="large" tip="Carregando dados..." />
      ) : (
        <Table columns={columns} dataSource={data} rowKey="ID_CONTRATO" />
      )}
    </div>
  );
};

export default BloqueadosDashboardVIRTELECOM;
