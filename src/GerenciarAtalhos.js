import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Upload, message, Modal, List, Card, Popconfirm } from 'antd';
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadImageToFirebase, saveShortcutToFirestore, getShortcutsFromFirestore, editShortcutInFirestore, deleteShortcutFromFirestore } from './firebaseUtils';
import './GerenciarAtalhos.css';

const GerenciarAtalhos = ({ userProfile }) => {
  const [loading, setLoading] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState(null);

  // Função para buscar atalhos do Firestore
  const fetchShortcuts = useCallback(async () => {
    if (userProfile?.id) {
      try {
        const fetchedShortcuts = await getShortcutsFromFirestore(userProfile.id);
        setShortcuts(fetchedShortcuts);
      } catch (error) {
        message.error('Erro ao buscar atalhos: ' + error.message);
      }
    }
  }, [userProfile?.id]); // useCallback memoriza a função para evitar redefinições desnecessárias

  useEffect(() => {
    fetchShortcuts();
  }, [fetchShortcuts]); // Agora o fetchShortcuts é estável e não causa re-renderizações desnecessárias

  const handleAddOrEditShortcut = async (values) => {
    setLoading(true);
    try {
      let imageUrl = values.image;

      // Se uma nova imagem foi carregada
      if (values.image?.file?.originFileObj) {
        imageUrl = await uploadImageToFirebase(values.image.file.originFileObj);
      }

      const shortcutData = {
        url: values.url,
        imgSrc: imageUrl,
        altText: values.altText,
        text: values.altText,
      };

      if (editingShortcut) {
        // Editar o atalho existente
        await editShortcutInFirestore(userProfile.id, editingShortcut.id, shortcutData);
        message.success('Atalho atualizado com sucesso!');
      } else {
        // Adicionar um novo atalho
        await saveShortcutToFirestore(userProfile.id, shortcutData);
        message.success('Atalho adicionado com sucesso!');
      }

      setIsModalVisible(false);
      fetchShortcuts(); // Atualizar a lista de atalhos após a operação
    } catch (error) {
      message.error('Erro ao salvar o atalho: ' + error.message);
    } finally {
      setLoading(false);
      setEditingShortcut(null); // Resetar o estado de edição
    }
  };

  const handleDeleteShortcut = async (shortcutId) => {
    try {
      await deleteShortcutFromFirestore(userProfile.id, shortcutId);
      message.success('Atalho excluído com sucesso!');
      fetchShortcuts(); // Atualizar a lista de atalhos após a exclusão
    } catch (error) {
      message.error('Erro ao excluir o atalho: ' + error.message);
    }
  };

  const openEditModal = (shortcut) => {
    setEditingShortcut(shortcut);
    setIsModalVisible(true);
  };

  return (
    <div className="gerenciar-atalhos">
      <div className="shortcut-list">
      <List
          grid={{ gutter: 24, column: 3 }} // Configurações para espaçamento e número de colunas
          dataSource={shortcuts}
          renderItem={(shortcut) => (
            <List.Item
              className="atalho-item"
              style={{
                display: 'flex',
                flexFlow: 'row wrap',
                minWidth: '0',
                flexDirection: 'row',
                alignContent: 'space-around',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <Card
                hoverable
                cover={<img alt={shortcut.altText} src={shortcut.imgSrc} />}
                actions={[
                  <EditOutlined key="edit" onClick={() => openEditModal(shortcut)} />,
                  <Popconfirm
                    title="Tem certeza que deseja excluir este atalho?"
                    onConfirm={() => handleDeleteShortcut(shortcut.id)}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <DeleteOutlined key="delete" />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={shortcut.text}
                  description={<a href={shortcut.url} target="_blank" rel="noopener noreferrer">Acessar</a>}
                />
              </Card>
            </List.Item>
          )}
        />
      </div>

      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        className="add-shortcut-btn"
        onClick={() => setIsModalVisible(true)}
      />

      <Modal
        title={editingShortcut ? 'Editar Atalho' : 'Adicionar Atalho'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingShortcut(null);
        }}
        footer={null}
      >
        <Form
          onFinish={handleAddOrEditShortcut}
          layout="vertical"
          initialValues={editingShortcut || { url: '', altText: '', image: '' }}
        >
          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: 'Por favor, insira a URL!' }]}
          >
            <Input placeholder="Digite a URL do atalho" />
          </Form.Item>
          <Form.Item
            label="Imagem"
            name="image"
            rules={[{ required: true, message: 'Por favor, insira a imagem do atalho!' }]}
          >
            <Upload listType="picture" maxCount={1} defaultFileList={editingShortcut ? [{ url: editingShortcut.imgSrc }] : []}>
              <Button icon={<UploadOutlined />}>Carregar Imagem</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Texto Alternativo (altText)"
            name="altText"
            rules={[{ required: true, message: 'Por favor, insira o altText!' }]}
          >
            <Input placeholder="Digite o altText do atalho" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {editingShortcut ? 'Salvar Alterações' : 'Adicionar Atalho'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default GerenciarAtalhos;
