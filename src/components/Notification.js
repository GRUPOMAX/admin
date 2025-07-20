import React, { useState, useEffect } from 'react';
import { List, Typography, Badge, Button } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          'https://nocodb.nexusnerds.com.br/api/v2/tables/m6vjm4kt2g89tt9/records',
          {
            params: {
              where: `(userId,eq,${userId})`,
            },
            headers: {
              'xc-token': 'u-xaPqP6ZrF_bFjtxe9ebnJuByFykIfTuh9g2Zky',
            },
          }
        );

        setNotifications(data.list);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `https://nocodb.nexusnerds.com.br/api/v2/tables/m6vjm4kt2g89tt9/records/${notificationId}`,
        { isRead: true },
        {
          headers: {
            'xc-token': 'u-xaPqP6ZrF_bFjtxe9ebnJuByFykIfTuh9g2Zky',
          },
        }
      );

      // Atualizar a lista de notificações após marcar como lida
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Notificações</Title>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(notification) => (
          <List.Item
            actions={[
              !notification.isRead && (
                <Button
                  type="link"
                  onClick={() => markAsRead(notification.id)}
                >
                  Marcar como lida
                </Button>
              ),
            ]}
          >
            <List.Item.Meta
              title={
                <Badge dot={!notification.isRead}>
                  <Text strong>{notification.title}</Text>
                </Badge>
              }
              description={notification.message}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notifications;
