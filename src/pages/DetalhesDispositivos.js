import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Table, Row, Col, Form, Input, Select, Button } from 'antd';
import './styles/DetalhesDispositivos.css';

const { Option } = Select;

const DetalhesDispositivos = ({ userProfile }) => {
  const [statusData, setStatusData] = useState({});
  const [detalhes, setDetalhes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [statusSelecionado, setStatusSelecionado] = useState(null);

  const isAdministradorOrDev = userProfile?.Cargo1 === 'Administrador' || userProfile?.Cargo1 === 'Desenvolvedor';

  useEffect(() => {
    if (!isAdministradorOrDev) {
      navigate('/home'); // Redireciona se o usuário não tiver permissão
    }
  }, [isAdministradorOrDev, navigate]);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const { data } = await axios.get('https://apidoixc.nexusnerds.com.br/Data/Resultados_Status.json');
        setStatusData(data.contagem);
        setDetalhes(data.detalhes);
        setFilteredData(data.detalhes); // Inicia com todos os dados sem filtro
      } catch (error) {
        console.error('Erro ao buscar os dados de status:', error);
      }
    };

    fetchStatusData();
  }, []);

  const handleFilter = (values) => {
    setStatusSelecionado(values.status); // Atualiza o status selecionado
    const filtered = detalhes.filter((item) => {
      return (
        (values.status ? item.status === values.status : true) &&
        (values.sn ? item.sn.toLowerCase().includes(values.sn.toLowerCase()) : true) &&
        (values.port ? item.port === values.port : true) &&
        (values.bairro ? item.bairro === values.bairro : true)
      );
    });
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span style={{ color: text === 'online' ? 'green' : text === 'desligado' ? 'orange' : 'red' }}>
          {text === 'offline' ? 'Desligado' : text.charAt(0).toUpperCase() + text.slice(1)}
        </span>
      ),
    },
    {
      title: 'SN',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: 'Porta',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: 'Bairro',
      dataIndex: 'bairro',
      key: 'bairro',
    },
  ];

  return (
    <div className="detalhes-dispositivos-container">
      <h2>
        Detalhes dos Dispositivos 
        {statusSelecionado ? ` (${statusSelecionado.charAt(0).toUpperCase() + statusSelecionado.slice(1)} - ${filteredData.length})` : ''}
      </h2>
      <Form layout="inline" form={form} onFinish={handleFilter} style={{ marginBottom: 20 }}>
        <Form.Item name="status" label="Status">
          <Select placeholder="Selecione o status" allowClear style={{ width: 150 }}>
            <Option value="online">Online</Option>
            <Option value="offline">Desligado</Option>
            <Option value="los">Perda de Sinal (LOS)</Option>
          </Select>
        </Form.Item>
        <Form.Item name="sn" label="SN">
          <Input placeholder="Digite o SN" />
        </Form.Item>
        <Form.Item name="port" label="Porta">
          <Select placeholder="Selecione a Porta" allowClear style={{ width: 100 }}>
            {Array.from({ length: 13 }, (_, i) => i + 1).map((port) => (
              <Option key={port} value={port}>
                {port}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="bairro" label="Bairro">
          <Select placeholder="Selecione o Bairro" allowClear style={{ width: 300 }}>
            <Option value="BAIRRO ARLINDO VILLASCHI 1-VILONE">BAIRRO ARLINDO VILLASCHI 1-VILONE</Option>
            <Option value="BAIRRO SOTECO">BAIRRO SOTECO</Option>
            <Option value="BAIRRO AREINHA">BAIRRO AREINHA</Option>
            <Option value="BAIRRO VALE DO SOL">BAIRRO VALE DO SOL</Option>
            <Option value="BAIRRO CAXIAS DO SUL">BAIRRO CAXIAS DO SUL</Option>
            <Option value="AV GURAPARI">AV GURAPARI</Option>
            <Option value="BAIRRO NOVA BETHANIA">BAIRRO NOVA BETHANIA</Option>
            <Option value="BAIRRO UNIVERSAL">BAIRRO UNIVERSAL</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Filtrar
          </Button>
        </Form.Item>
      </Form>
      <Row>
        <Col span={24}>
          <Card title="Detalhes dos Dispositivos">
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="sn"
              pagination={{ pageSize: 5 }}
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetalhesDispositivos;
