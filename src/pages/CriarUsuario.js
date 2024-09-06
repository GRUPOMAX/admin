import React, { useState } from 'react';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/pt-br'; // Para trabalhar com datas no padrão brasileiro
import axios from 'axios';
import UploadImage from '../components/UploadImage'; // Importe o componente de upload
import './styles/CriarUsuario.css';

// Configure o moment para usar o formato brasileiro
moment.locale('pt-br');

const CriarUsuario = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');

  const handleImageUpload = (url) => {
    setProfilePicUrl(url);
  };

  const handleSubmit = (values) => {
    setLoading(true);

    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      Cargo1: values.Cargo1,
      username: values.username,
      profilePicUrl: profilePicUrl,
      empresa: values.empresa,
      nascimento: values.nascimento ? values.nascimento.format('YYYY-MM-DD') : '', // Converte para formato de data ISO
    };

    console.log('Payload enviado:', payload); // Adicione este log para inspecionar o payload

    axios
      .post(
        'https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records',
        payload,
        {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
        }
      )
      .then((response) => {
        console.log('Resposta da API:', response.data); // Log da resposta da API
        message.success('Usuário criado com sucesso!');
        form.resetFields();
      })
      .catch((error) => {
        console.error('Erro ao criar usuário:', error.response?.data || error.message); // Log do erro detalhado
        message.error('Erro ao criar usuário.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="criar-usuario-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: '',
          email: '',
          nascimento: '',
          password: '',
          username: '',
          Cargo1: '',
          empresa: '', // Valor inicial para a seleção única de empresa
        }}
      >
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
        >
          <Input placeholder="Digite o nome completo" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Por favor, insira o email!' }]}
        >
          <Input placeholder="Digite o email" />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: 'Por favor, insira a senha!' }]}
        >
          <Input.Password placeholder="Digite a senha" />
        </Form.Item>
        <Form.Item
          label="Nome de Usuário (Login)"
          name="username"
          rules={[{ required: true, message: 'Por favor, insira o nome de usuário!' }]}
        >
          <Input placeholder="Digite o nome de usuário" />
        </Form.Item>
        <Form.Item
          label="Cargo"
          name="Cargo1"
          rules={[{ required: true, message: 'Por favor, selecione o cargo!' }]}
        >
          <Select placeholder="Selecione o cargo">
            <Select.Option value="Administrador">Administrador</Select.Option>
            <Select.Option value="Financeiro">Financeiro</Select.Option>
            <Select.Option value="Vendedor">Vendedor</Select.Option>
          </Select>
        </Form.Item>

        {/* Campo de Data de Nascimento */}
        <Form.Item
          label="Data de Nascimento"
          name="nascimento"
          rules={[{ required: true, message: 'Por favor, insira a data de nascimento!' }]}
        >
          <DatePicker 
            format="DD/MM/YYYY"
            placeholder="DD/MM/AAAA" // Placeholder em formato brasileiro
            allowClear // Permite que o campo seja apagado e manualmente digitado
            inputReadOnly={false} // Permite que o usuário digite a data
            disabledDate={(current) => current && current > moment().endOf('day')} // Impede datas futuras
          />
        </Form.Item>

        <Form.Item
          label="Empresa"
          name="empresa"
          rules={[{ required: true, message: 'Por favor, selecione uma empresa!' }]}
        >
          <Select placeholder="Selecione a empresa">
            <Select.Option value="Max Fibra">Max Fibra</Select.Option>
            <Select.Option value="Vir Telecom">Vir Telecom</Select.Option>
            <Select.Option value="Reis Services">Reis Services</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Upload de Foto">
          <UploadImage onImageUpload={handleImageUpload} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Criar Usuário
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CriarUsuario;
