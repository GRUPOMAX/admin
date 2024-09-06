import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, DatePicker } from 'antd';
import moment from 'moment';
import 'moment/locale/pt-br'; // Para trabalhar com datas no padrão brasileiro
import axios from 'axios';
import UploadImage from './UploadImage'; // Importe o componente de upload
import './EditarPerfil.css';

const EditarPerfil = ({ userProfile, onProfileUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile && userProfile.id) {
      // Buscar os dados do usuário com base no ID
      axios
        .get(`https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records/${userProfile.id}`, {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
        })
        .then((response) => {
          const userData = response.data;
          if (userData) {
            form.setFieldsValue({
              name: userData.name,
              email: userData.email,
              nascimento: moment(userData.nascimento, 'YYYY-MM-DD'), // Ajustar a data para o formato correto
              password: userData.password,
              profilePicUrl: userData.profilePicUrl,
              Cargo1: userData.Cargo1,
            });
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar dados do usuário:', error);
          message.error('Erro ao buscar dados do usuário.');
        });
    } else {
      message.error('ID do usuário não está definido.');
    }
  }, [userProfile, form]);

  const handleImageUpload = (url) => {
    form.setFieldsValue({ profilePicUrl: url });
  };

  const handleSubmit = (values) => {
    if (!userProfile || !userProfile.id) {
      message.error('ID do usuário não está definido.');
      return;
    }

    setLoading(true);

    axios
      .patch(
        `https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records`,
        {
          Id: userProfile.id,
          email: values.email,
          password: values.password,
          nascimento: values.nascimento,
          Cargo1: values.Cargo1,
          name: values.name,
          profilePicUrl: values.profilePicUrl,
        },
        {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
        }
      )
      .then((response) => {
        const updatedProfile = {
          ...userProfile,
          name: values.name,
          email: values.email,
          profilePic: values.profilePicUrl,
        };
        onProfileUpdate(updatedProfile);
        message.success('Perfil atualizado com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao atualizar o perfil:', error);
        message.error('Erro ao atualizar o perfil.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="editar-perfil-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: '',
          email: '',
          password: '',
          profilePicUrl: '',
          Cargo1: '',
        }}
      >
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
        >
          <Input placeholder="Digite seu nome Completo" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Por favor, insira seu email!' }]}
        >
          <Input placeholder="Digite seu email" />
        </Form.Item>
        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
        >
          <Input.Password placeholder="Digite sua senha" />
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
            disabled // Desabilitar o campo para que não seja editável
          />
        </Form.Item>
        <Form.Item
          label="URL da Foto de Perfil"
          name="profilePicUrl"
          rules={[{ required: false, message: 'Por favor, insira a URL da sua foto de perfil!' }]}
        >
          <Input placeholder="Digite a URL da sua foto de perfil" disabled />
        </Form.Item>
        <Form.Item label="Upload de Foto">
          <UploadImage onImageUpload={handleImageUpload} />
        </Form.Item>
        <Form.Item
          label="Cargo"
          name="Cargo1"
          rules={[{ required: true, message: 'Por favor, selecione seu cargo!' }]}
        >
          <Input value={userProfile.Cargo1} disabled />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Salvar Alterações
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditarPerfil;
