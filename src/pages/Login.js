import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import axios from 'axios';
import { getBackgroundConfig } from '../firebaseUtils';

import './styles/Login.css';

const { Title } = Typography;

const Login = ({ onLogin }) => {
  const [background, setBackground] = useState(''); // Definindo o estado para o background
  const [loading, setLoading] = useState(false); // Definindo o estado para loading
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const fetchedBackgroundUrl = await getBackgroundConfig(); // Obtém a URL do fundo
        if (fetchedBackgroundUrl) {
          setBackground(fetchedBackgroundUrl); // Atualiza o estado com a URL do fundo
        }
      } catch (error) {
        console.error('Erro ao carregar o fundo:', error);
      }
    };

    fetchBackground(); // Chama a função para buscar o fundo
  }, []);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // Realiza a consulta buscando pelo username ou email
      const { data } = await axios.get('https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records', {
        params: {
          where: `(username,eq,${values.username})`,
        },
        headers: {
          'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
        },
      });

      if (data.list.length > 0) {
        const user = data.list[0];
        if (user.password === values.password) {
          const userProfile = {
            id: user.Id,
            name: user.name || user.username,
            email: user.email,
            profilePic: user.profilePicUrl,
            Cargo1: user.Cargo1,
          };
          onLogin(userProfile);
          navigate('/home');
        } else {
          message.error('Senha incorreta.');
        }
      } else {
        message.error('Usuário não encontrado.');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      message.error('Erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="login-form-wrapper">
        <Card style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
          <Title level={3} style={{ textAlign: 'center' }}>Login</Title>
          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item
              label="Usuário"
              name="username"
              rules={[{ required: true, message: 'Por favor, insira seu usuário!' }]}
            >
              <Input placeholder="Digite seu usuário" />
            </Form.Item>
            <Form.Item
              label="Senha"
              name="password"
              rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
            >
              <Input.Password placeholder="Digite sua senha" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
