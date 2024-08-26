import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, Avatar, Card, Badge } from 'antd';
import './UsuariosOnline.css'; // Para adicionar estilos personalizados

const UsuariosOnline = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuariosOnline = async () => {
      try {
        const { data } = await axios.get('https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records', {
          params: {
            where: `(isOnline,eq,true)`, // Filtra apenas os usuários que estão online
          },
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
        });
        setUsuarios(data.list);
      } catch (error) {
        console.error('Erro ao buscar usuários online:', error);
      }
    };

    // Inicia a verificação a cada 3 segundos
    const intervalId = setInterval(fetchUsuariosOnline, 3000);

    // Limpa o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, []);

  const getStatusIndicator = (isOnline) => {
    return (
      <Badge
        status={isOnline ? 'success' : 'error'}
        text={isOnline ? 'Online Agora' : 'Offline'}
      />
    );
  };

  return (
    <div className="usuarios-online-container">
      <Card title="Usuários Online" bordered={false}>
        <List
          itemLayout="horizontal"
          dataSource={usuarios}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={user.profilePicUrl || 'https://via.placeholder.com/150'} />}
                title={
                  <div className="user-title">
                    {user.name || user.username} {getStatusIndicator(user.isOnline)}
                  </div>
                }
                description={
                  <>
                    <div className="last-active">
                      Última Atividade: {new Date(user.lastActiveAt).toLocaleString()}
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default UsuariosOnline;
