import React, { useState, useEffect } from 'react';
import { Upload, Button, Input, Card, message, Popconfirm } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadImageToFirebase, getImagesFromFirestore, saveImageToFirestore, deleteImageFromFirestore } from './firebaseUtils';
import './GalleryPage.css'

const GalleryPage = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [imageName, setImageName] = useState(''); // Estado para armazenar o nome da imagem

  const fetchGalleryImages = async () => {
    try {
      const images = await getImagesFromFirestore();
      setGalleryImages(images);
    } catch (error) {
      message.error('Erro ao carregar a galeria: ' + error.message);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const beforeUpload = (file) => {
    if (!imageName.trim()) {
      message.error('Por favor, insira um nome para a imagem antes de fazer o upload.');
      return false; // Impede o upload se o nome da imagem não foi inserido
    }
    handleUpload(file);
    return false; // Impede que o Upload do Ant Design faça o upload automaticamente
  };

  const handleUpload = async (file) => {
    try {
      if (!file) {
        throw new Error('Arquivo não encontrado ou estrutura incorreta.');
      }

      const extension = file.name.split('.').pop(); // Obtém a extensão do arquivo
      const fileName = `${imageName}.${extension}`; // Concatena o nome da imagem com a extensão

      // Cria um novo objeto File com o nome atualizado
      const newFile = new File([file], fileName, { type: file.type });

      const imageUrl = await uploadImageToFirebase(newFile); // Faz o upload da imagem para o Firebase Storage
      await saveImageToFirestore(imageUrl, imageName); // Salva a URL da imagem no Firestore com o nome correto
      message.success('Imagem enviada com sucesso!');
      setImageName(''); // Limpa o campo de nome da imagem após o upload
      fetchGalleryImages(); // Atualiza a galeria após o upload
    } catch (error) {
      message.error('Erro ao enviar a imagem: ' + error.message);
    }
  };

  const handleDeleteImage = async (imageId, imageUrl) => {
    try {
      await deleteImageFromFirestore(imageId, imageUrl); // Função que apaga a imagem do Firestore e Firebase Storage
      message.success('Imagem apagada com sucesso!');
      fetchGalleryImages(); // Atualiza a galeria após a exclusão
    } catch (error) {
      message.error('Erro ao apagar a imagem: ' + error.message);
    }
  };

  return (
    <div className="gallery-container">
      <h2>Galeria de Imagens</h2>

      <Input 
        className="gallery-input"
        placeholder="Digite o nome da imagem"
        value={imageName}
        onChange={(e) => setImageName(e.target.value)}
      />

      <Upload beforeUpload={beforeUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />} className="gallery-upload-btn">Carregar Imagem</Button>
      </Upload>

      <div className="gallery-cards">
        {galleryImages.map((image) => (
          <Card
            key={image.id}
            hoverable
            className="gallery-card"
            cover={<img alt={image.label} src={image.url} />}
            actions={[
              <Popconfirm
                title="Tem certeza que deseja apagar esta imagem?"
                onConfirm={() => handleDeleteImage(image.id, image.url)}
                okText="Sim"
                cancelText="Não"
              >
                <DeleteOutlined style={{ color: 'red' }} />
              </Popconfirm>,
            ]}
          >
            <Card.Meta title={image.label} /> {/* Exibindo o nome da imagem corretamente */}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
