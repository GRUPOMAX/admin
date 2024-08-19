import React from 'react';
import { Typography, Layout } from 'antd'; // Importando componentes do Ant Design
import './Home.css';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const Home = () => {
  return (
    <Layout className="home">
      <Content className="content">
        <Title level={1}>Página Inicial</Title>
        <Paragraph>Informações de contato.</Paragraph>
      </Content>
    </Layout>
  );
};

export default Home;
