import { ref, uploadBytesResumable, getDownloadURL, deleteObject  } from 'firebase/storage';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, setDoc } from 'firebase/firestore'; // Certifique-se de importar getDoc e setDoc
import { storage, db } from './firebaseConfig';




// Função para verificar e criar o documento do usuário no Firestore
export const ensureUserDocumentExists = async (userId) => {
  const userDocRef = doc(db, 'users', String(userId));
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // Documento não existe, vamos criá-lo
    try {
      await setDoc(userDocRef, {
        companies: [] // ou qualquer estrutura inicial que você deseja
      });
      console.log(`Documento criado para o usuário ${userId}`);
    } catch (error) {
      console.error(`Erro ao criar documento para o usuário ${userId}:`, error);
      throw error;
    }
  } else {
    console.log(`Documento já existe para o usuário ${userId}`);
  }
};

// Função para fazer upload de imagem no Firebase Storage
export const uploadImageToFirebase = (file) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error('Erro durante o upload da imagem:', error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        }).catch((error) => {
          console.error('Erro ao obter a URL de download:', error);
          reject(error);
        });
      }
    );
  });
};

// Função para salvar atalho no Firestore
export const saveShortcutToFirestore = async (userId, shortcutData) => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/shortcuts`), shortcutData);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar atalho no Firestore:", error);
    throw new Error("Erro ao salvar atalho no Firestore: " + error.message);
  }
};

// Função para obter atalhos do Firestore
export const getShortcutsFromFirestore = async (userId) => {
  try {
    const snapshot = await getDocs(collection(db, `users/${userId}/shortcuts`));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao obter atalhos do Firestore:", error);
    throw new Error("Erro ao obter atalhos do Firestore: " + error.message);
  }
};

// Função para editar um atalho no Firestore
export const editShortcutInFirestore = async (userId, shortcutId, updatedData) => {
  try {
    const docRef = doc(db, `users/${userId}/shortcuts`, shortcutId);
    await updateDoc(docRef, updatedData);
    return true;
  } catch (error) {
    console.error("Erro ao editar o atalho no Firestore:", error);
    throw new Error("Erro ao editar o atalho no Firestore: " + error.message);
  }
};

// Função para apagar um atalho do Firestore
export const deleteShortcutFromFirestore = async (userId, shortcutId) => {
  try {
    const docRef = doc(db, `users/${userId}/shortcuts`, shortcutId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao apagar o atalho no Firestore:", error);
    throw new Error("Erro ao apagar o atalho no Firestore: " + error.message);
  }
};

// Função para salvar a URL da imagem de fundo no Firestore
export const saveBackgroundConfig = async (backgroundUrl) => {
  try {
    await setDoc(doc(db, 'config', 'loginBackground'), { url: backgroundUrl });
  } catch (error) {
    throw new Error('Erro ao salvar configuração de fundo: ' + error.message);
  }
};

// Função para obter a URL da imagem de fundo do Firestore
export const getBackgroundConfig = async () => {
  try {
    const docRef = doc(db, 'config', 'loginBackground');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().url;
    } else {
      console.log('Nenhuma configuração de fundo encontrada.');
      return null;
    }
  } catch (error) {
    throw new Error('Erro ao obter configuração de fundo: ' + error.message);
  }
};



export const getMultiShortcutsFromFirestore = async (userId) => {
  try {
    const multiShortcutsRef = collection(db, 'users', userId, 'multiShortcuts');
    const snapshot = await getDocs(multiShortcutsRef);
    const multiShortcuts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return multiShortcuts;
  } catch (error) {
    console.error("Erro ao buscar multi atalhos: ", error);
    throw error;
  }
};



// Função para obter imagens do Firestore
export const getImagesFromFirestore = async () => {
  try {
    const imagesRef = collection(db, 'galleryImages'); // Supondo que você tenha uma coleção chamada 'galleryImages'
    const snapshot = await getDocs(imagesRef);
    const images = snapshot.docs.map(doc => ({
      id: doc.id,
      url: doc.data().url, // A URL da imagem armazenada no Firestore
      label: doc.data().label || `Imagem ${doc.id}` // Nome ou label da imagem
    }));
    return images;
  } catch (error) {
    console.error("Erro ao buscar imagens da galeria: ", error);
    throw error;
  }
};

// Função para salvar imagens na coleção 'galleryImages' com o nome
export const saveImageToFirestore = async (imageUrl, imageName) => {
  try {
    const docRef = await addDoc(collection(db, 'galleryImages'), { 
      url: imageUrl,
      label: imageName // Salvando o nome da imagem no campo 'label'
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar imagem na galeria: ", error);
    throw error;
  }
};

export const deleteImageFromFirestore = async (imageId, imageUrl) => {
  try {
    // Deleta o documento do Firestore
    await deleteDoc(doc(db, 'galleryImages', imageId));

    // Deleta a imagem do Firebase Storage
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);

  } catch (error) {
    console.error("Erro ao apagar a imagem: ", error);
    throw error;
  }
};
