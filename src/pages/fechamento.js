import React, { useState } from 'react';
import { Form, InputNumber, Card, Row, Col, Typography, Button, message } from 'antd';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import './styles/Fechamento.css';

const { Title, Text } = Typography;

const Fechamento = () => {
  const [totalGeral, setTotalGeral] = useState(0);
  const [form] = Form.useForm();

  const handleValuesChange = (_, allValues) => {
    const totalMoedas = [
      { valor: 1, quantidade: allValues.moedas_1 || 0 },
      { valor: 0.50, quantidade: allValues.moedas_0_50 || 0 },
      { valor: 0.25, quantidade: allValues.moedas_0_25 || 0 },
    ].reduce((acc, moeda) => acc + (moeda.valor * moeda.quantidade), 0);

    const totalNotasFrente = [
      { valor: 20, quantidade: allValues.notas_fren_20 || 0 },
      { valor: 10, quantidade: allValues.notas_fren_10 || 0 },
      { valor: 5, quantidade: allValues.notas_fren_5 || 0 },
      { valor: 2, quantidade: allValues.notas_fren_2 || 0 },
    ].reduce((acc, nota) => acc + (nota.valor * nota.quantidade), 0);

    const totalNotasInterno = [
      { valor: 100, quantidade: allValues.notas_interno_100 || 0 },
      { valor: 50, quantidade: allValues.notas_interno_50 || 0 },
      { valor: 20, quantidade: allValues.notas_interno_20 || 0 },
      { valor: 10, quantidade: allValues.notas_interno_10 || 0 },
      { valor: 5, quantidade: allValues.notas_interno_5 || 0 },
      { valor: 2, quantidade: allValues.notas_interno_2 || 0 },
    ].reduce((acc, nota) => acc + (nota.valor * nota.quantidade), 0);

    const totalGeralAtual = totalMoedas + totalNotasFrente + totalNotasInterno;

    setTotalGeral(totalGeralAtual);
  };

  const handleGerarRelatorio = async () => {
    const allValues = form.getFieldsValue();
    const date = new Date().toISOString().split('T')[0]; // Data atual (YYYY-MM-DD)
    
    try {
      const empresaRef = doc(db, "empresas", "ReisServices");
      const empresaDoc = await getDoc(empresaRef);

      if (!empresaDoc.exists()) {
        await setDoc(empresaRef, {});
      }

      const relatorioRef = doc(db, "empresas/ReisServices/relatorios", date);
      await setDoc(relatorioRef, {
        totalMoedas: allValues.moedas_1 || 0,
        totalNotasFrente: {
          notas_20: allValues.notas_fren_20 || 0,
          notas_10: allValues.notas_fren_10 || 0,
          notas_5: allValues.notas_fren_5 || 0,
          notas_2: allValues.notas_fren_2 || 0,
        },
        totalNotasInterno: {
          notas_100: allValues.notas_interno_100 || 0,
          notas_50: allValues.notas_interno_50 || 0,
          notas_20: allValues.notas_interno_20 || 0,
          notas_10: allValues.notas_interno_10 || 0,
          notas_5: allValues.notas_interno_5 || 0,
          notas_2: allValues.notas_interno_2 || 0,
        },
        totalGeral,
        data: date
      });

      message.success("Relatório gerado e salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar o relatório: ", error);
      message.error("Erro ao salvar o relatório. Verifique o console para mais detalhes.");
    }
  };

  const handleGerarBackup = () => {
    const allValues = form.getFieldsValue();
    const date = new Date().toISOString().split('T')[0]; // Data atual (YYYY-MM-DD)
    
    const data = [
      { 
        Categoria: 'Moedas', 
        'R$ 1,00': allValues.moedas_1 || 0, 
        'R$ 0,50': allValues.moedas_0_50 || 0, 
        'R$ 0,25': allValues.moedas_0_25 || 0 
      },
      { 
        Categoria: 'Notas - Caixa Frente', 
        'R$ 20,00': allValues.notas_fren_20 || 0, 
        'R$ 10,00': allValues.notas_fren_10 || 0, 
        'R$ 5,00': allValues.notas_fren_5 || 0, 
        'R$ 2,00': allValues.notas_fren_2 || 0 
      },
      { 
        Categoria: 'Notas - Caixa Interno', 
        'R$ 100,00': allValues.notas_interno_100 || 0, 
        'R$ 50,00': allValues.notas_interno_50 || 0, 
        'R$ 20,00': allValues.notas_interno_20 || 0, 
        'R$ 10,00': allValues.notas_interno_10 || 0, 
        'R$ 5,00': allValues.notas_interno_5 || 0, 
        'R$ 2,00': allValues.notas_interno_2 || 0 
      },
      { 
        Categoria: 'Total Geral', 
        Total: totalGeral.toFixed(2)
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

    XLSX.writeFile(workbook, `Backup_Relatório_${date}.xlsx`);

    message.success("Backup gerado com sucesso!");
  };

  return (
    <div className="reis-services-container">
      <Card title="Fechamento Diário - Moedas e Notas">
        <Form layout="vertical" onValuesChange={handleValuesChange} form={form}>
          <Title level={4}>Moedas</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="R$ 1,00" name="moedas_1">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="R$ 0,50" name="moedas_0_50">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="R$ 0,25" name="moedas_0_25">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={4}>Notas - Caixa Frente</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="R$ 20,00" name="notas_fren_20">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="R$ 10,00" name="notas_fren_10">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="R$ 5,00" name="notas_fren_5">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="R$ 2,00" name="notas_fren_2">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Title level={4}>Notas - Caixa Interno</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="R$ 100,00" name="notas_interno_100">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="R$ 50,00" name="notas_interno_50">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="R$ 20,00" name="notas_interno_20">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="R$ 10,00" name="notas_interno_10">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="R$ 5,00" name="notas_interno_5">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="R$ 2,00" name="notas_interno_2">
                <InputNumber min={0} placeholder="Quantidade" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>Total Geral</Title>
        <Text strong style={{ fontSize: '18px' }}>R$ {totalGeral.toFixed(2)}</Text>
      </Card>

      <Row gutter={16} justify="left" style={{ marginTop: '24px' }}>
        <Col span={5}>
          <Button type="primary" onClick={handleGerarRelatorio} style={{ width: '100%' }}>
            Gerar Relatório
          </Button>
        </Col>
        <Col span={4}>
          <Button type="default" onClick={handleGerarBackup} style={{ width: '100%', padding: '20px',  textAlign: 'center'}}>
            Gerar Backup
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Fechamento;
