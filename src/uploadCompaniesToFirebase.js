import { doc, setDoc } from "firebase/firestore";
import axios from 'axios';
import { db } from './firebaseConfig';

const uploadCompaniesToFirebase = async (userProfile) => {
  if (!userProfile) {
    console.error('Nenhum perfil de usuário fornecido.');
    return;
  }

  try {
    // Solicita dados da API
    const response = await axios.get('https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records', {
      headers: {
        'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
      },
    });

    const users = response.data.list;
    const stringUserId = String(userProfile.id);

    // Encontra o usuário específico na lista
    const user = users.find(u => String(u.Id) === stringUserId);

    if (user && user.empresa) {
      // Divide a string de empresas em um array
      const userCompanies = user.empresa.split(',').map(company => company.trim().toLowerCase());

      // Salva ou atualiza as empresas no Firebase
      await setDoc(doc(db, "users", stringUserId), {
        companies: userCompanies,
      }, { merge: true });

      console.log("Empresas associadas ao usuário foram salvas no Firebase:", userCompanies);
    } else {
      console.error('Usuário não tem empresas associadas ou não foi encontrado.');
    }
  } catch (error) {
    console.error('Erro ao buscar ou salvar os dados do usuário:', error);
  }
};

export default uploadCompaniesToFirebase;
