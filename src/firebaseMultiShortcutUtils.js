import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Função para salvar multi atalhos no Firestore
export const saveMultiShortcutToFirestore = async (userId, multiShortcutData) => {
  try {
    const docRef = await addDoc(collection(db, `users/${userId}/multiShortcuts`), multiShortcutData);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar multi atalho no Firestore:", error);
    throw new Error("Erro ao salvar multi atalho no Firestore: " + error.message);
  }
};


// Função para buscar multi atalhos do Firestore
export const getMultiShortcutsFromFirestore = async (userId) => {
    try {
      const multiShortcutsRef = collection(db, `users/${userId}/multiShortcuts`);
      const snapshot = await getDocs(multiShortcutsRef);
      
      // Adicione logs para verificar o conteúdo do snapshot
      console.log("Snapshot de multi atalhos:", snapshot);
      
      const multiShortcuts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Adicione logs para verificar os dados mapeados
      console.log("Multi atalhos mapeados:", multiShortcuts);
      
      return multiShortcuts;
    } catch (error) {
      console.error("Erro ao buscar multi atalhos: ", error);
      throw error;
    }
  };
  

// Função para editar multi atalhos no Firestore
export const editMultiShortcutInFirestore = async (userId, shortcutId, updatedData) => {
  try {
    const docRef = doc(db, `users/${userId}/multiShortcuts`, shortcutId);
    await updateDoc(docRef, updatedData);
    return true;
  } catch (error) {
    console.error("Erro ao editar multi atalho no Firestore:", error);
    throw new Error("Erro ao editar multi atalho no Firestore: " + error.message);
  }
};

// Função para deletar multi atalhos no Firestore
export const deleteMultiShortcutFromFirestore = async (userId, shortcutId) => {
  try {
    const multiShortcutRef = doc(db, `users/${userId}/multiShortcuts`, shortcutId);
    await deleteDoc(multiShortcutRef);
    console.log(`Multi Atalho ${shortcutId} deletado com sucesso.`);
  } catch (error) {
    console.error("Erro ao deletar multi atalho do Firestore:", error);
    throw new Error("Erro ao deletar multi atalho: " + error.message);
  }
};
