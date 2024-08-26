// src/components/UploadImage.js
import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig'; // Importe sua configuração

const UploadImage = ({ onImageUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async ({ file }) => {
    setUploading(true);
    const storageRef = ref(storage, `images/${file.name}`);

    try {
      // Faz o upload da imagem
      await uploadBytes(storageRef, file);

      // Obtém a URL da imagem armazenada
      const url = await getDownloadURL(storageRef);
      onImageUpload(url); // Passe a URL de volta ao componente pai ou faça o que precisar com ela
      message.success('Imagem carregada com sucesso!');
    } catch (error) {
      message.error('Erro ao carregar a imagem.');
      console.error('Erro ao carregar a imagem no Firebase:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Upload
      customRequest={handleUpload}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />} loading={uploading}>
        Carregar Imagem
      </Button>
    </Upload>
  );
};

export default UploadImage;
