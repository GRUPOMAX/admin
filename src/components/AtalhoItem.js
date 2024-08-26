import React from 'react';
import { Card, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './AtalhoItem.css';

const AtalhoItem = ({ url, imgSrc, altText, text, onRemove }) => (
  <Card
    hoverable
    cover={<img alt={altText} src={imgSrc} />}
    actions={[
      <Button danger icon={<DeleteOutlined />} onClick={onRemove}>
        Remover
      </Button>,
    ]}
  >
    <Card.Meta title={text} description={url} />
  </Card>
);

export default AtalhoItem;
