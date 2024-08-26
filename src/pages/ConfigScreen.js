import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadImageToFirebase } from '../firebaseUtils';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ConfigScreen = ({ userProfile }) => {
  const [loading, setLoading] = useState(false);

  if (userProfile?.Cargo1 !== 'Desenvolvedor') {
    return <p>Acesso negado. Somente desenvolvedores podem acessar esta página.</p>;
  }

  const handleSaveBackground = async (values) => {
    setLoading(true);
    try {
      let backgroundUrl = values.backgroundUrl;
      if (values.image?.file?.originFileObj) {
        backgroundUrl = await uploadImageToFirebase(values.image.file.originFileObj);
      }

      // Salva a URL no Firestore usando setDoc (cria ou atualiza o documento)
      const configDocRef = doc(db, 'appConfig', 'loginBackground');
      await setDoc(configDocRef, { backgroundUrl }, { merge: true });

      message.success('Fundo da tela de login atualizado com sucesso!');
    } catch (error) {
      message.error('Erro ao atualizar o fundo da tela de login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config-screen-container">
      <Card style={{ maxWidth: 500, margin: 'auto' }}>
        <h2>Configurações</h2>
        <Form layout="vertical" onFinish={handleSaveBackground}>
          <Form.Item
            label="URL da Imagem de Fundo"
            name="backgroundUrl"
            rules={[{ required: false, message: 'Por favor, insira a URL da imagem!' }]}
          >
            <Input placeholder="Digite a URL da imagem de fundo" />
          </Form.Item>
          <Form.Item label="Ou Carregue uma Imagem" name="image">
            <Upload listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Carregar Imagem</Button>
            </Upload>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Salvar Fundo
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ConfigScreen;
