import { doc, setDoc, updateDoc, arrayUnion, getDocs, collection, query, where,onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const startNewChat = async (userId, targetUserId) => {
  try {
    console.log(`Verificando conversa existente entre userId: ${userId} e targetUserId: ${targetUserId}`);

    const targetId = String(targetUserId);  // Certifique-se de que isso é uma string
    const userIdStr = String(userId);  // Certifique-se de que isso é uma string

    // Verificar se já existe uma conversa entre os dois usuários
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', userIdStr));
    const querySnapshot = await getDocs(q);

    let existingChatId = null;

    querySnapshot.forEach((docSnapshot) => {
      const chatData = docSnapshot.data();
      console.log(`Verificando chatId: ${docSnapshot.id} com participantes: ${chatData.participants}`);

      if (chatData.participants.includes(targetId)) {
        existingChatId = docSnapshot.id;
        console.log(`Conversa existente encontrada com ID: ${existingChatId}`);
      }
    });

    // Se já existir uma conversa, retorne o ID da conversa existente
    if (existingChatId) {
      console.log(`Retornando ID da conversa existente: ${existingChatId}`);
      return existingChatId;
    }

    // Se não existir, crie uma nova conversa
    const chatId = `chat_${Date.now()}`;
    const chatDocRef = doc(db, 'chats', chatId);

    console.log(`Nenhuma conversa encontrada. Criando nova conversa com ID: ${chatId}`);

    await setDoc(chatDocRef, {
      participants: [userIdStr, targetId],
      messages: [],
      createdAt: new Date(),
    });

    // Atualizar a lista de conversas de ambos os participantes
    const userDocRef1 = doc(db, 'users', userIdStr);
    const userDocRef2 = doc(db, 'users', targetId);

    await updateDoc(userDocRef1, {
      activeChats: arrayUnion(chatId),
    });

    await updateDoc(userDocRef2, {
      activeChats: arrayUnion(chatId),
    });

    console.log(`Nova conversa criada com ID: ${chatId}`);
    return chatId;
  } catch (error) {
    console.error('Erro ao iniciar nova conversa:', error);
    throw new Error('Erro ao iniciar nova conversa: ' + error.message);
  }
};

export const sendMessage = async (chatId, senderId, senderName, message) => {
  try {
    const chatDocRef = doc(db, 'chats', chatId);
    const timestamp = new Date();

    await updateDoc(chatDocRef, {
      messages: arrayUnion({
        senderId,
        senderName,
        message,
        timestamp,
      }),
    });

    console.log(`Mensagem enviada para chatId: ${chatId}`);
  } catch (error) {
    console.error('Erro ao enviar a mensagem:', error);
    throw new Error('Erro ao enviar a mensagem: ' + error.message);
  }
};

export const listenToMessages = (chatId, callback) => {
  const chatDocRef = doc(db, 'chats', chatId);

  return onSnapshot(chatDocRef, (snapshot) => {
    const chatData = snapshot.data();
    if (chatData) {
      callback(chatData.messages);
    }
  });
};

export const getActiveUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const activeUsersSnapshot = await getDocs(usersRef);
    const activeUsers = activeUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return activeUsers;
  } catch (error) {
    console.error('Erro ao buscar usuários ativos:', error);
    throw new Error('Erro ao buscar usuários ativos: ' + error.message);
  }
};
