// src/components/Notification.js
import React from 'react';
import './NotificationBadge.css'; // Certifique-se de que o caminho está correto

const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div className="notification">
      {message}
    </div>
  );
};

export default Notification;
