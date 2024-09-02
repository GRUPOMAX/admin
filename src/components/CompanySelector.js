import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore"; 
import { db } from '../firebaseConfig';
import uploadCompaniesToFirebase from '../uploadCompaniesToFirebase';

const CompanySelector = ({ userProfile }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!userProfile || !userProfile.id) {
        console.error('UserID não está disponível.');
        setError("UserID não está disponível.");
        setLoading(false);
        return;
      }

      try {
        console.log("Iniciando a busca de empresas no Firebase para o usuário:", userProfile.id);

        // Faça o upload das novas empresas para garantir que o Firebase esteja atualizado
        await uploadCompaniesToFirebase(userProfile);

        // Recupere as empresas atualizadas do Firebase
        const docRef = doc(db, "users", String(userProfile.id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Dados recuperados do documento Firebase:", data);
          setCompanies(data.companies || []);
        } else {
          setError('Nenhum documento encontrado para esse usuário.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do Firebase:', error);
        setError('Erro ao buscar dados do Firebase');
      } finally {
        setLoading(false);
      }
    };

    if (userProfile && userProfile.id) {
      fetchCompanies();
    }
  }, [userProfile]);

  return (
    <div>
      <h2>Verificando userProfile</h2>
      {loading ? (
        <div>Carregando empresas...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div>
          <h2>Empresas Disponíveis:</h2>
          <ul>
            {companies.length > 0 ? (
              companies.map((company, index) => (
                <li key={index}>{company}</li>
              ))
            ) : (
              <li>Nenhuma empresa disponível</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
