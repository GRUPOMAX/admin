import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Input, Button, List, Card, Popconfirm, Select, Form, Upload, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { 
    uploadImageToFirebase, 
    saveShortcutToFirestore, 
    getShortcutsFromFirestore, 
    editShortcutInFirestore, 
    deleteShortcutFromFirestore,
    getImagesFromFirestore // Importa a função para buscar as imagens
} from './firebaseUtils';
import { getMultiShortcutsFromFirestore, saveMultiShortcutToFirestore, deleteMultiShortcutFromFirestore, editMultiShortcutInFirestore } from './firebaseMultiShortcutUtils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

import './GerenciarAtalhos.css';


const { Option } = Select;

const GerenciarAtalhos = ({ userProfile }) => {
  const [form] = Form.useForm(); 
  const [loading, setLoading] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState(null);
  const [isMultiShortcut, setIsMultiShortcut] = useState(false);
  const [links, setLinks] = useState(['']);
  const [imageSource, setImageSource] = useState("upload"); 
  const [imageUrl, setImageUrl] = useState('');
  const [predefinedImages, setPredefinedImages] = useState([]); // Estado para armazenar as imagens pré-definidas

  const numAtalhos = shortcuts.length;

  // Função para carregar as imagens pré-definidas do Firestore
  const fetchPredefinedImages = async () => {
    try {
      const images = await getImagesFromFirestore();
      const formattedImages = images.map(image => ({
        value: image.url,
        label: image.label
      }));
      setPredefinedImages(formattedImages);
    } catch (error) {
      message.error('Erro ao carregar as imagens: ' + error.message);
    }
  };

  useEffect(() => {
    fetchPredefinedImages();
  }, []);

  const gridLayout = {
    gutter: 24,
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 3,
    xxl: numAtalhos === 3 ? 3 : 2,
  };

  const fetchShortcuts = useCallback(async () => {
    if (userProfile?.id) {
      try {
        const simpleShortcuts = await getShortcutsFromFirestore(userProfile.id);
        console.log('Simple shortcuts fetched from Firebase:', simpleShortcuts);
  
        const multiShortcuts = await getMultiShortcutsFromFirestore(userProfile.id);
        console.log('Multi shortcuts fetched from Firebase:', multiShortcuts);
  
        const combinedShortcuts = [...simpleShortcuts, ...multiShortcuts];
        setShortcuts(combinedShortcuts);
      } catch (error) {
        message.error('Erro ao buscar atalhos: ' + error.message);
      }
    }
  }, [userProfile?.id]);
  

  useEffect(() => {
    fetchShortcuts();
  }, [fetchShortcuts]);

  const handleMultiShortcutChange = (value) => {
    setIsMultiShortcut(value === 'multi');
    form.setFieldsValue({
      url: '',
      links: ['']
    });
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };
  
  const handleAddLink = () => {
    setLinks([...links, '']);
  };
  

  const resetFormFields = () => {
    form.resetFields(); 
    setLinks(['']); 
    setIsMultiShortcut(false); 
    setImageSource('upload'); 
    setImageUrl(''); 
  };

  const handleAddOrEditShortcut = async (values) => {
    setLoading(true);
    try {
      let imageUrl = values.image;
  
      if (imageSource === 'upload' && values.image?.file?.originFileObj) {
        imageUrl = await uploadImageToFirebase(values.image.file.originFileObj);
      } else if (imageSource === 'predefined') {
        imageUrl = values.predefinedImage;
      } else if (imageSource === 'url') {
        imageUrl = values.imageUrl;
      }
  
      let newShortcut;
  
      if (isMultiShortcut) {
        const multiShortcutData = {
          links,
          imgSrc: imageUrl,
          altText: values.altText,
          createdAt: new Date(),
        };
  
        if (editingShortcut) {
          const docRef = doc(db, `users/${userProfile.id}/multiShortcuts/${editingShortcut.id}`);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            console.log("Editando Multi Atalho com ID:", editingShortcut.id);
            await editMultiShortcutInFirestore(userProfile.id, editingShortcut.id, multiShortcutData);
            message.success('Multi Atalho atualizado com sucesso!');
            setShortcuts((prevShortcuts) =>
              prevShortcuts.map((shortcut) =>
                shortcut.id === editingShortcut.id ? { ...shortcut, ...multiShortcutData } : shortcut
              )
            );
          } else {
            message.error('Erro: O multi atalho que você está tentando editar não existe.');
            setIsModalVisible(false);
            return;
          }
        } else {
          const newId = await saveMultiShortcutToFirestore(userProfile.id, multiShortcutData);
          newShortcut = { id: newId, ...multiShortcutData };
          setShortcuts((prevShortcuts) => [...prevShortcuts, newShortcut]);
          message.success('Multi Atalho adicionado com sucesso!');
        }
      } else {
        const shortcutData = {
          url: values.url,
          imgSrc: imageUrl,
          altText: values.altText,
          text: values.altText,
        };
  
        if (editingShortcut) {
          const docRef = doc(db, `users/${userProfile.id}/shortcuts/${editingShortcut.id}`);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            console.log("Editando Atalho com ID:", editingShortcut.id);
            await editShortcutInFirestore(userProfile.id, editingShortcut.id, shortcutData);
            message.success('Atalho atualizado com sucesso!');
            setShortcuts((prevShortcuts) =>
              prevShortcuts.map((shortcut) =>
                shortcut.id === editingShortcut.id ? { ...shortcut, ...shortcutData } : shortcut
              )
            );
          } else {
            message.error('Erro: O atalho que você está tentando editar não existe.');
            setIsModalVisible(false);
            return;
          }
        } else {
          const newId = await saveShortcutToFirestore(userProfile.id, shortcutData);
          newShortcut = { id: newId, ...shortcutData };
          setShortcuts((prevShortcuts) => [...prevShortcuts, newShortcut]);
          message.success('Atalho adicionado com sucesso!');
        }
      }
  
      setIsModalVisible(false);
      setEditingShortcut(null);
      resetFormFields(); 
    } catch (error) {
      console.error('Erro ao salvar o atalho no Firestore:', error.message);
      message.error('Erro ao salvar o atalho: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteShortcut = async (shortcutId, isMultiShortcut = false) => {
    try {
      if (isMultiShortcut) {
        await deleteMultiShortcutFromFirestore(userProfile.id, shortcutId);
      } else {
        await deleteShortcutFromFirestore(userProfile.id, shortcutId);
      }
      message.success('Atalho excluído com sucesso!');
      fetchShortcuts(); 
    } catch (error) {
      message.error('Erro ao excluir o atalho: ' + error.message);
    }
  };

// Função para abrir o modal de edição
const openEditModal = (shortcut) => {
  setEditingShortcut(shortcut);
  setIsModalVisible(true);

  // Verifica se o atalho é do tipo Multi Atalho e se os links estão presentes
  const isMulti = Array.isArray(shortcut.links) && shortcut.links.length > 0;
  setIsMultiShortcut(isMulti);

  // Log para verificar o conteúdo dos links recebidos do Firebase
  console.log("Links recebidos do Firebase:", shortcut.links);

  // Define os links no estado, garantindo que estejam no formato correto
  setLinks(isMulti ? shortcut.links : ['']);

  // Atualiza os valores do formulário com os dados recebidos
  const fieldsToSet = {
      altText: shortcut.altText || '',
      url: !isMulti ? shortcut.url : '', // Limpa a URL se for Multi Atalho
      imageSource: 'upload', // Define a fonte de imagem padrão como 'upload'
      imageUrl: shortcut.imgSrc || '', // Usa a URL da imagem existente
      shortcutType: isMulti ? 'multi' : 'single', // Define o tipo de atalho
  };

  // Se for multi, precisamos setar os campos de links individualmente
  if (isMulti) {
      shortcut.links.forEach((link, index) => {
          fieldsToSet[`link${index}`] = link;
      });
  }

  form.setFieldsValue(fieldsToSet);
};
  
  return (
    <div className="gerenciar-atalhos">
      <div className="shortcut-list">
        <List
          grid={gridLayout}
          dataSource={shortcuts}
          renderItem={(shortcut) => (
            <List.Item className="atalho-item">
              <Card
                hoverable
                cover={<img alt={shortcut.altText} src={shortcut.imgSrc} />}
                actions={[
                  <EditOutlined key="edit" onClick={() => openEditModal(shortcut)} />,
                  <Popconfirm
                    title="Tem certeza que deseja excluir este atalho?"
                    onConfirm={() => handleDeleteShortcut(shortcut.id, Array.isArray(shortcut.links))}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <DeleteOutlined key="delete" />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={(
                    <>
                      {shortcut.altText || shortcut.text}
                      {Array.isArray(shortcut.links) && shortcut.links.length > 0 && (
                        <Tag color="green" style={{ marginLeft: '8px' }}>
                          Multi Atalho
                        </Tag>
                      )}
                    </>
                  )}
                  description={
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (Array.isArray(shortcut.links) && shortcut.links.length > 0) {
                          shortcut.links.forEach((link) => window.open(link, '_blank'));
                        } else {
                          window.open(shortcut.url, '_blank');
                        }
                      }}
                    >
                      Acessar
                    </a>
                  }
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
          resetFormFields(); 
        }}
        footer={null}
      >
        <Form
          form={form} 
          onFinish={handleAddOrEditShortcut}
          layout="vertical"
          initialValues={editingShortcut || { url: '', altText: '', image: '' }}
        >
          <Form.Item
            label="Título"
            name="altText"
            rules={[{ required: true, message: 'Por favor, insira o título!' }]}
          >
            <Input placeholder="Digite o título do atalho" />
          </Form.Item>

          <Form.Item
            label="Fonte da Imagem"
            name="imageSource"
            rules={[{ required: true, message: 'Por favor, selecione a fonte da imagem!' }]}
          >
            <Select value={imageSource} onChange={setImageSource}>
              <Option value="upload">Carregar Imagem</Option>
              <Option value="predefined">Selecionar do Banco de Imagens</Option>
              <Option value="url">Inserir URL da Imagem</Option>
            </Select>
          </Form.Item>

          {imageSource === 'upload' && (
            <Form.Item
              label="Imagem"
              name="image"
              rules={[{ required: true, message: 'Por favor, insira a imagem do atalho!' }]}>
              <Upload listType="picture" maxCount={1} defaultFileList={editingShortcut ? [{ url: editingShortcut.imgSrc }] : []}>
                <Button icon={<UploadOutlined />}>Carregar Imagem</Button>
              </Upload>
            </Form.Item>
          )}

          {imageSource === 'predefined' && (
            <Form.Item
              label="Imagem Predefinida"
              name="predefinedImage"
              rules={[{ required: true, message: 'Por favor, selecione uma imagem predefinida!' }]}>
              <Select placeholder="Escolha uma imagem">
                {predefinedImages.map(image => (
                  <Option key={image.value} value={image.value}>{image.label}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {imageSource === 'url' && (
            <Form.Item
              label="URL da Imagem"
              name="imageUrl"
              rules={[{ required: true, message: 'Por favor, insira a URL da imagem!' }]}>
              <Input
                placeholder="Digite a URL da imagem"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </Form.Item>
          )}

          <Form.Item
              label="Tipo de Atalho"
              name="shortcutType"
              rules={[{ required: true, message: 'Por favor, selecione o tipo de atalho!' }]}
          >
              <Select value={isMultiShortcut ? 'multi' : 'single'} onChange={handleMultiShortcutChange}>
                  <Option value="single">Atalho Único</Option>
                  <Option value="multi">Multi Atalho</Option>
              </Select>
          </Form.Item>

          {isMultiShortcut ? (
              <>
                  {links.map((link, index) => (
                      <Form.Item
                          key={index}
                          label={`Link ${index + 1}`}
                          name={`link${index}`}
                          rules={[{ required: true, message: `Por favor, insira o link ${index + 1}!` }]}
                      >
                          <Input
                              placeholder={`Digite o link ${index + 1}`}
                              value={link}
                              onChange={(e) => handleLinkChange(index, e.target.value)}
                          />
                      </Form.Item>
                  ))}
                  <Button onClick={handleAddLink} style={{ marginTop: 10 }}>
                      Adicionar Mais
                  </Button>
              </>
          ) : (
              <Form.Item
                  label="URL"
                  name="url"
                  rules={[{ required: true, message: 'Por favor, insira a URL!' }]}
              >
                  <Input placeholder="Digite a URL do atalho" />
              </Form.Item>
          )}

          <Button type="primary" htmlType="submit" loading={loading} block>
            {editingShortcut ? 'Salvar Alterações' : 'Adicionar Atalho'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default GerenciarAtalhos;
