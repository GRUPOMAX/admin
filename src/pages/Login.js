import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { getDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './styles/Login.css';

const { Title } = Typography;

const Login = ({ onLogin }) => {
  const [background, setBackground] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const docRef = doc(db, 'appConfig', 'loginBackground');
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setBackground(data.backgroundUrl);
            console.log('Background atualizado:', data.backgroundUrl);
          } else {
            console.log('Nenhuma configuração de fundo encontrada.');
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao carregar o fundo:', error);
      }
    };

    fetchBackground();
  }, []);

  const updateOnlineStatus = async (user, isOnline) => {
    try {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const userData = {
        Id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        Cargo1: user.Cargo1,
        username: user.username,
        profilePicUrl: user.profilePic,
        isOnline: isOnline,
        lastActiveAt: now,
      };

      console.log('Atualizando status para:', userData);

      const response = await axios.patch(
        'https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records',
        userData,
        {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
        }
      );

      console.log('Resposta da API ao atualizar status:', response.data);
    } catch (error) {
      console.error(`Erro ao atualizar o status ${isOnline ? 'online' : 'offline'}:`, error);
    }
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records', {
        params: {
          where: `(username,eq,${values.username})`,
        },
        headers: {
          'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
        },
      });

      console.log('Dados retornados do NocoDB:', data);

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

          await updateOnlineStatus(userProfile, true); // Atualiza o status para online
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

  const handleLogout = async (user) => {
    try {
      console.log('Fazendo logout do usuário:', user);
      await updateOnlineStatus(user, false); // Atualiza o status para offline
    } catch (error) {
      console.error('Erro ao atualizar o status offline:', error);
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', () => handleLogout(onLogin()));
    return () => {
      window.removeEventListener('beforeunload', () => handleLogout(onLogin()));
    };
  }, []);

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
