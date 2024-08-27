import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BairroChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>Carregando dados...</p>;
  }

  return (
    <ResponsiveContainer width="70%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#006aff" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BairroChart;
