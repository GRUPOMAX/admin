import React, { useEffect, useState } from 'react';
import { getShortcutsFromFirestore } from '../firebaseUtils';
import LinkItem from './LinkItem';

const ExibirAtalhos = ({ userProfile }) => {
  const [atalhos, setAtalhos] = useState([]);

  useEffect(() => {
    const fetchShortcuts = async () => {
      const userShortcuts = await getShortcutsFromFirestore(userProfile.id);
      setAtalhos(userShortcuts);
    };

    fetchShortcuts();
  }, [userProfile.id]);

  return (
    <div className="atalhos-container">
      {atalhos.map((atalho, index) => (
        <LinkItem key={index} {...atalho} />
      ))}
    </div>
  );
};

export default ExibirAtalhos;
