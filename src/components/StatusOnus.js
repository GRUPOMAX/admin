import React from 'react';
import { Card } from 'antd';

const StatusOnus = ({ data }) => {
  if (!data || data.length === 0) return <p>Nenhum dado disponível.</p>;

  return (
    <Card title="Status das ONUs">
      <ul>
        {data.map((onu, index) => (
          <li key={index}>
            {onu.nome}: {onu.status} {/* Aqui você pode ajustar como exibir as informações */}
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default StatusOnus;
