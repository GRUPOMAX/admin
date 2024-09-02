import { db } from "./firebaseConfig";
import {
  collection,
  doc, // Adicione esta linha para corrigir o erro
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Função para adicionar uma tarefa a uma lista
export const addTaskToList = async (userId, title, description, timer, expirationDate, senderName, isSender, recipientNames) => {
  const newTask = {
    listId: userId,
    title,
    description,
    expirationDate,
    createdAt: new Date(),
    completed: false,
    senderName: senderName || 'Desconhecido', // Armazena o nome do remetente
    isSender: isSender !== undefined ? isSender : true, // Armazena se o usuário é o remetente
    recipientNames: recipientNames || 'Desconhecido' // Armazena os nomes dos destinatários
  };

  // Só adiciona o campo timer se ele não for undefined
  if (timer !== undefined) {
    newTask.timer = timer;
  }

  const docRef = await addDoc(collection(db, "tasks"), newTask);
  return docRef.id;
};


// Função para buscar as tarefas de uma lista
export const getTasksFromList = async (listId) => {
  const q = query(collection(db, "tasks"), where("listId", "==", listId));
  const querySnapshot = await getDocs(q);
  const tasks = [];
  querySnapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });
  return tasks;
};

// Função para atualizar uma tarefa
export const updateTask = async (taskId, updatedTaskData) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, updatedTaskData);
};

// Função para deletar uma tarefa
export const deleteTask = async (taskId) => {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
};
