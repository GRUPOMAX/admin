import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';
import UploadImage from '../components/UploadImage'; // Importe o componente de upload
import './styles/CriarUsuario.css';

const CriarUsuario = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');

  const handleImageUpload = (url) => {
    setProfilePicUrl(url);
  };

  const handleSubmit = (values) => {
    setLoading(true);

    axios
      .post(
        'https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records',
        {
          name: values.name,
          email: values.email,
          password: values.password,
          Cargo1: values.Cargo1,
          username: values.username,
          profilePicUrl: profilePicUrl,
        },
        {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
        }
      )
      .then((response) => {
        message.success('Usuário criado com sucesso!');
        form.resetFields();
      })
      .catch((error) => {
        console.error('Erro ao criar usuário:', error);
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
          password: '',
          username: '',
          Cargo1: '',
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
