import React from 'react';
import { Form, Input, Button, Typography, Select, Steps, DatePicker, message } from 'antd';
import InputMask from 'react-input-mask'; // Importar o react-input-mask
import 'antd/dist/reset.css'; // Importar os estilos do Ant Design
import './styles/Cadastro.css';

const { Title } = Typography;
const { Option } = Select;
const { Step } = Steps;

const Cadastro = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({});

  const webhookUrl = 'https://webhook.nexusnerds.com.br/webhook/7b6905d3-0548-464a-a620-9bbdffe66b97';

  const steps = [
    {
      title: 'Passo 1',
      content: (
        <div className="form-container">
          <Form.Item
            name="NomeCompleto"
            label="Nome Completo"
            rules={[{ required: true, message: 'Por favor, insira seu nome completo!' }]}
          >
            <Input placeholder="Digite seu nome completo" />
          </Form.Item>
          <Form.Item
            name="CPF_FISICO"
            label="CPF"
            rules={[{ required: true, message: 'Por favor, insira seu CPF!' }]}
          >
            <InputMask mask="999.999.999-99" placeholder="Digite seu CPF">
              {(inputProps) => <Input {...inputProps} />}
            </InputMask>
          </Form.Item>
          <Form.Item
            name="RG"
            label="RG"
            rules={[{ required: true, message: 'Por favor, insira seu RG!' }]}
          >
            <Input placeholder="Digite seu RG" />
          </Form.Item>
          <Form.Item
            name="NASCIMENTO"
            label="Data de Nascimento"
            rules={[{ required: true, message: 'Por favor, insira sua data de nascimento!' }]}
          >
            <DatePicker placeholder="Selecione a data" format="DD/MM/YYYY" />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Passo 2',
      content: (
        <div className="form-container">
          <Form.Item
            name="EMAIL_CONTATO"
            label="Email"
            rules={[{ required: true, message: 'Por favor, insira seu email!' }]}
          >
            <Input placeholder="Digite seu email" />
          </Form.Item>
          <Form.Item
            name="Tel_01"
            label="Telefone 1"
            rules={[{ required: true, message: 'Por favor, insira seu telefone!' }]}
          >
            <InputMask mask="(99) 99999-9999" placeholder="Digite seu telefone">
              {(inputProps) => <Input {...inputProps} />}
            </InputMask>
          </Form.Item>
          <Form.Item
            name="Tel_02"
            label="Telefone 2"
            rules={[
              { required: true, message: 'Por favor, insira seu telefone!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('Tel_01') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('O Telefone 2 não pode ser igual ao Telefone 1.'));
                },
              }),
            ]}
          >
            <InputMask mask="(99) 99999-9999" placeholder="Digite um segundo telefone (opcional)">
              {(inputProps) => <Input {...inputProps} />}
            </InputMask>
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Passo 3',
      content: (
        <div className="form-container">
          <Form.Item
            name="Cidade"
            label="Cidade"
            rules={[{ required: true, message: 'Por favor, insira sua cidade!' }]}
          >
            <Input placeholder="Digite sua cidade" />
          </Form.Item>
          <Form.Item
            name="Bairro"
            label="Bairro"
            rules={[{ required: true, message: 'Por favor, insira seu bairro!' }]}
          >
            <Input placeholder="Digite seu bairro" />
          </Form.Item>
          <Form.Item
            name="Endereco_Completo"
            label="End.: Completo"
            rules={[{ required: true, message: 'Por favor, insira seu endereço!' }]}
          >
            <Input placeholder="Digite seu endereço completo" />
          </Form.Item>
          <Form.Item
            name="cep_residencia"
            label="CEP"
            rules={[{ required: true, message: 'Por favor, insira seu CEP!' }]}
          >
            <InputMask mask="99999-999" placeholder="Digite seu CEP">
              {(inputProps) => <Input {...inputProps} />}
            </InputMask>
          </Form.Item>
          <Form.Item
            name="n_residencia"
            label="Nª da Residência"
            rules={[{ required: true, message: 'Por favor, insira o número da residência!' }]}
          >
            <Input placeholder="Digite o número da residência" />
          </Form.Item>
          <Form.Item
            name="complemento"
            label="Complemento"
            rules={[{ required: false }]}
          >
            <Input placeholder="Digite o complemento (opcional)" />
          </Form.Item>
          <Form.Item
            name="Referencia_Endereco"
            label="Ref.: de Endereço"
            rules={[{ required: false }]}
          >
            <Input placeholder="Digite a referência de endereço (opcional)" />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Passo 4',
      content: (
        <div className="form-container">
          <Form.Item
            name="Plano_Selecionado"
            label="Plano Selecionado"
            rules={[{ required: true, message: 'Por favor, selecione um plano!' }]}
          >
            <Select placeholder="Selecione um plano">
              <Option value="17">Turbo R$  99,90</Option>
              <Option value="15">Infinity R$ 169,90</Option>
              <Option value="14">Gold R$ 129,90</Option>
              <Option value="13">Retenção R$ 59,90</Option>
              <Option value="23">Streaming</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="streaming_Adicional"
            label="Streaming Adicional"
            rules={[{ required: false }]}
          >
            <Select placeholder="Selecione uma opção de streaming">
              <Option value="Streaming_Telas">Streaming Telas</Option>
              <Option value="Streaming_ChromeCast">Streaming + ChomeCast</Option>
              <Option value="Nao">Não</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="Data_Vencimento"
            label="Data de Vencimento"
            rules={[{ required: true, message: 'Por favor, insira a data de vencimento!' }]}
          >
            <Select placeholder="Selecione a data Vencimento">
              <Option value="5">Dia 05</Option>
              <Option value="10">Dia 10</Option>
              <Option value="20">Dia 20</Option>
            </Select>
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Passo 5',
      content: (
        <div className="form-container">
          <Form.Item
            name="vendedor"
            label="Vendedor"
            rules={[{ required: true, message: 'Por favor, insira o nome do vendedor!' }]}
          >
              <Select placeholder="Selecione o Vendedor">
              <Option value="Tatiara">Tatiara Kister</Option>
              <Option value="Fabio">Fabio Morais</Option>
            </Select>
          </Form.Item>
        </div>
      ),
    },
  ];

  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prevData) => ({
        ...prevData,
        ...values,
      }));
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      form.resetFields();
    } catch (error) {
      console.error('Erro ao validar os campos: ', error);
    }
  };

  const prev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = async (values) => {
    try {
      const completeData = { ...formData, ...values };

      // Envia os dados para o webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      });

      if (response.ok) {
        message.success('Dados enviados com sucesso!');
      } else {
        message.error('Falha ao enviar os dados. Tente novamente.');
      }
    } catch (error) {
      message.error('Erro ao conectar com o webhook.');
    }
  };

  return (
    <div className="cadastro-container">
      <Title level={2}>Cadastro</Title>
      <Steps current={currentStep} className="steps">
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>
      <div className="steps-content">
        <Form
          form={form}
          onFinish={handleFinish}
        >
          {steps[currentStep].content}
          <div className="steps-action">
            {currentStep > 0 && (
              <Button type="default" className="btn-prev" onClick={prev}>
                Voltar
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" className="btn-next" onClick={next}>
                Seguir
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit" className="btn-next">
                Concluir
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Cadastro;
