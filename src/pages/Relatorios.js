import React, { useEffect, useState } from 'react';
import { Table, Typography, Card, Row, Col, message, Select, Button } from 'antd';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import './styles/Relatorios.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Relatorios = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedRelatorio, setSelectedRelatorio] = useState(null);

  useEffect(() => {
    const fetchRelatorios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "empresas/ReisServices/relatorios"));
        const data = querySnapshot.docs.map(doc => ({
          key: doc.id,
          ...doc.data()
        }));
        setRelatorios(data);
        setLoading(false);

        const today = new Date().toISOString().split('T')[0];
        const defaultData = data.find(rel => rel.data === today)?.data || data[0]?.data;
        setSelectedData(defaultData);
        setSelectedRelatorio(data.find(rel => rel.data === defaultData));
      } catch (error) {
        console.error("Erro ao buscar os relatórios: ", error);
        message.error("Erro ao buscar os relatórios. Verifique o console para mais detalhes.");
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, []);

  const formatCurrency = (value) => `R$ ${value.toFixed(2)}`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateTotal = (record) => {
    const totalMoedas = record.totalMoedas;
    const totalNotasFrente = 
      (record.totalNotasFrente.notas_20 * 20) +
      (record.totalNotasFrente.notas_10 * 10) +
      (record.totalNotasFrente.notas_5 * 5) +
      (record.totalNotasFrente.notas_2 * 2);
    const totalNotasInterno = 
      (record.totalNotasInterno.notas_100 * 100) +
      (record.totalNotasInterno.notas_50 * 50) +
      (record.totalNotasInterno.notas_20 * 20) +
      (record.totalNotasInterno.notas_10 * 10) +
      (record.totalNotasInterno.notas_5 * 5) +
      (record.totalNotasInterno.notas_2 * 2);

    return totalMoedas + totalNotasFrente + totalNotasInterno;
  };

  const handleDateChange = (date) => {
    setSelectedData(date);
    const relatorio = relatorios.find(r => r.data === date);
    setSelectedRelatorio(relatorio);
  };

  const handleGenerateXLSX = () => {
    if (!selectedRelatorio) {
      message.warning('Nenhum relatório selecionado para gerar o arquivo.');
      return;
    }

    const wsData = [
      ["Data", "Quantidade de Moedas", "Quantidade de Notas Frente", "Quantidade de Notas Interna", "Total"],
      [
        formatDate(selectedRelatorio.data),
        `Moedas de 1 Real: ${formatCurrency(selectedRelatorio.totalMoedas)}`,
        `Notas de R$ 20,00: ${formatCurrency(selectedRelatorio.totalNotasFrente.notas_20 * 20)}`,
        `Notas de R$ 100,00: ${formatCurrency(selectedRelatorio.totalNotasInterno.notas_100 * 100)}`,
        formatCurrency(calculateTotal(selectedRelatorio))
      ],
      [
        '',
        `Moedas de 0,50 Centavos: ${formatCurrency(selectedRelatorio.totalMoedas * 0.5)}`,
        `Notas de R$ 10,00: ${formatCurrency(selectedRelatorio.totalNotasFrente.notas_10 * 10)}`,
        `Notas de R$ 50,00: ${formatCurrency(selectedRelatorio.totalNotasInterno.notas_50 * 50)}`
      ],
      [
        '',
        `Moedas de 0,25 Centavos: ${formatCurrency(selectedRelatorio.totalMoedas * 0.25)}`,
        `Notas de R$ 5,00: ${formatCurrency(selectedRelatorio.totalNotasFrente.notas_5 * 5)}`,
        `Notas de R$ 20,00: ${formatCurrency(selectedRelatorio.totalNotasInterno.notas_20 * 20)}`
      ],
      [
        '',
        '',
        `Notas de R$ 2,00: ${formatCurrency(selectedRelatorio.totalNotasFrente.notas_2 * 2)}`,
        `Notas de R$ 10,00: ${formatCurrency(selectedRelatorio.totalNotasInterno.notas_10 * 10)}`
      ],
      [
        '',
        '',
        '',
        `Notas de R$ 5,00: ${formatCurrency(selectedRelatorio.totalNotasInterno.notas_5 * 5)}`
      ],
      [
        '',
        '',
        '',
        `Notas de R$ 2,00: ${formatCurrency(selectedRelatorio.totalNotasInterno.notas_2 * 2)}`
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");
    XLSX.writeFile(wb, `Relatório_${formatDate(selectedRelatorio.data)}.xlsx`);
  };

  const columns = [
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      render: text => <Text>{formatDate(text)}</Text>,
    },
    {
      title: 'Quantidade de Moedas',
      dataIndex: 'totalMoedas',
      key: 'totalMoedas',
      render: value => <Text>{formatCurrency(value)}</Text>,
    },
    {
      title: 'Quantidade de Notas Frente',
      dataIndex: 'totalNotasFrente',
      key: 'totalNotasFrente',
      render: (text, record) => (
        <div>
          <p><strong>R$ 20,00:</strong> {formatCurrency(record.totalNotasFrente.notas_20 * 20)}</p>
          <p><strong>R$ 10,00:</strong> {formatCurrency(record.totalNotasFrente.notas_10 * 10)}</p>
          <p><strong>R$ 5,00:</strong> {formatCurrency(record.totalNotasFrente.notas_5 * 5)}</p>
          <p><strong>R$ 2,00:</strong> {formatCurrency(record.totalNotasFrente.notas_2 * 2)}</p>
        </div>
      ),
    },
    {
      title: 'Quantidade de Notas Interna',
      dataIndex: 'totalNotasInterno',
      key: 'totalNotasInterno',
      render: (text, record) => (
        <div>
          <p><strong>R$ 100,00:</strong> {formatCurrency(record.totalNotasInterno.notas_100 * 100)}</p>
          <p><strong>R$ 50,00:</strong> {formatCurrency(record.totalNotasInterno.notas_50 * 50)}</p>
          <p><strong>R$ 20,00:</strong> {formatCurrency(record.totalNotasInterno.notas_20 * 20)}</p>
          <p><strong>R$ 10,00:</strong> {formatCurrency(record.totalNotasInterno.notas_10 * 10)}</p>
          <p><strong>R$ 5,00:</strong> {formatCurrency(record.totalNotasInterno.notas_5 * 5)}</p>
          <p><strong>R$ 2,00:</strong> {formatCurrency(record.totalNotasInterno.notas_2 * 2)}</p>
        </div>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (text, record) => <Text strong>{formatCurrency(calculateTotal(record))}</Text>,
    },
  ];

  const chartData = relatorios.map((record) => ({
    data: formatDate(record.data),
    total: calculateTotal(record),
  }));

  return (
    <div className="custom-relatorio-container">
      <Title level={2} className="custom-relatorio-title">Relatórios Fechamento Diario</Title>

      <Row justify="center" className="custom-select">
        <Col span={24}>
          <Select 
            placeholder="Selecione uma data" 
            onChange={handleDateChange} 
            value={selectedData}
            style={{ width: '100%' }}
          >
            {relatorios.map(relatorio => (
              <Option key={relatorio.data} value={relatorio.data}>
                {formatDate(relatorio.data)}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {selectedRelatorio && (
        <Row justify="center" style={{ marginBottom: '20px' }}>
          <Col span={24}>
            <Card className="custom-relatorio-card" hoverable>
              <Table 
                dataSource={[selectedRelatorio]} 
                columns={columns} 
                pagination={false}
                bordered={false}
                className="custom-relatorio-table"
              />
            </Card>
          </Col>
        </Row>
      )}

      {chartData.length > 0 && (
        <Row justify="center" className="custom-chart-card">
          <Col span={24}>
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </Col>
        </Row>
      )}

      <Row justify="center" style={{ marginTop: '20px' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={handleGenerateXLSX}>
            Gerar Relatório XLSX
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Relatorios;
