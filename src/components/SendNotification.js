import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Checkbox, message, Card } from 'antd';
import axios from 'axios';

const { Option } = Select;

const SendNotification = () => {
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records', {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          },
        });
        setUsers(data.list);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSendNotification = async (values) => {
    try {
      const notificationData = {
        title: values.title,
        message: values.message,
        isRead: false,
        createdAt_: null,
      };

      if (values.sendToAll) {
        const userIds = users.map(user => user.Id);
        await sendNotificationToUsers(userIds, notificationData);
      } else {
        await sendNotificationToUsers(values.userIds, notificationData);
      }

      message.success('Notificação enviada com sucesso!');
      form.resetFields();
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      message.error('Erro ao enviar a notificação.');
    }
  };

  const sendNotificationToUsers = async (userIds, notificationData) => {
    for (const userId of userIds) {
      await axios.post(
        'https://nocodb.nexusnerds.com.br/api/v2/tables/myd2oats63ype1t/records',
        {
          ...notificationData,
          userId,
        },
        {
          headers: {
            'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
          }
        }
      );
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Enviar Notificação</h2>
        <Form form={form} onFinish={handleSendNotification} layout="vertical">
          <Form.Item
            label="Título"
            name="title"
            rules={[{ required: true, message: 'Por favor, insira o título da notificação.' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mensagem"
            name="message"
            rules={[{ required: true, message: 'Por favor, insira a mensagem da notificação.' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="sendToAll" valuePropName="checked">
            <Checkbox>Enviar para todos os usuários</Checkbox>
          </Form.Item>

          {!form.getFieldValue('sendToAll') && (
            <Form.Item
              label="Selecione os usuários"
              name="userIds"
              rules={[{ required: true, message: 'Por favor, selecione ao menos um usuário.' }]}
            >
              <Select mode="multiple" placeholder="Selecione os usuários">
                {users.map(user => (
                  <Option key={user.Id} value={user.Id}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}>
              Enviar Notificação
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SendNotification;
