// src/notesService.js
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

export const addNote = async (userId, title, content, expirationDate) => {
    try {
        const noteRef = await addDoc(collection(db, 'notes'), {
            userId,
            title,
            content,
            expirationDate: expirationDate ? new Date(expirationDate) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return noteRef;
    } catch (error) {
        console.error("Erro ao adicionar nota ao Firestore: ", error);
        throw error;
    }
};

export const getUserNotes = async (userId) => {
    try {
        const q = query(collection(db, 'notes'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const notes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return notes;
    } catch (error) {
        console.error("Erro ao recuperar notas do Firestore: ", error);
        throw error;
    }
};

export const updateNote = async (noteId, title, content, expirationDate) => {
    try {
        const noteRef = doc(db, 'notes', noteId);
        await updateDoc(noteRef, {
            title,
            content,
            expirationDate: expirationDate ? new Date(expirationDate) : null,
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error("Erro ao atualizar nota no Firestore: ", error);
        throw error;
    }
};

export const deleteNote = async (noteId) => {
    try {
        const noteRef = doc(db, 'notes', noteId);
        await deleteDoc(noteRef);
    } catch (error) {
        console.error("Erro ao deletar nota no Firestore: ", error);
        throw error;
    }
};
