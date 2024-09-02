import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button, Modal, Input, Card, Typography } from 'antd';
import { addNote, getUserNotes, updateNote, deleteNote } from '../notesService';
import dayjs from 'dayjs';
import './Notes.css';

const { Title } = Typography;

const Notes = ({ userProfile }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const userId = userProfile.id;

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const fetchNotes = async () => {
    try {
      const userNotes = await getUserNotes(userId);
      setNotes(userNotes);
    } catch (error) {
      console.error("Erro ao recuperar notas:", error);
    }
  };

  const handleAddNote = async () => {
    if (userId && title && content) {
      try {
        const currentDate = new Date();
        await addNote(userId, title, content, currentDate);
        setTitle(''); // Reseta o título após adicionar a nota
        setContent(''); // Reseta o conteúdo após adicionar a nota
        fetchNotes();
      } catch (error) {
        console.error("Erro ao adicionar nota: ", error);
      }
    } else {
      console.error('Dados incompletos: userId, title, content são necessários.');
    }
  };

  const showModal = (note) => {
    setCurrentNote(note);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentNote(null);
  };

  const handleUpdateNote = async () => {
    if (currentNote) {
      try {
        let validExpirationDate = currentNote.expirationDate;
  
        // Verifica se a data está em um formato de timestamp (por exemplo, Firebase Timestamp)
        if (validExpirationDate && validExpirationDate.seconds) {
          validExpirationDate = new Date(validExpirationDate.seconds * 1000);
        }
  
        // Verifica se validExpirationDate é uma instância válida de Date
        if (!(validExpirationDate instanceof Date) || isNaN(validExpirationDate.getTime())) {
          throw new Error('Invalid time value');
        }
  
        const updatedNote = {
          ...currentNote,
          expirationDate: validExpirationDate,
        };
  
        await updateNote(
          updatedNote.id,
          updatedNote.title,
          updatedNote.content,
          updatedNote.expirationDate
        );
        fetchNotes();
        handleCancel();
      } catch (error) {
        console.error("Erro ao atualizar nota: ", error);
      }
    }
  };
  

  const handleDeleteNote = async () => {
    if (currentNote && currentNote.id) {
      try {
        await deleteNote(currentNote.id);
        fetchNotes();
        handleCancel();
      } catch (error) {
        console.error("Erro ao deletar nota: ", error);
      }
    }
  };

  const renderNewStatus = (creationDate) => {
    const today = dayjs().startOf('day');
    const noteDate = dayjs(creationDate.seconds * 1000).startOf('day');
    return noteDate.isSame(today) ? 'Novo' : '';
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="notes-container">
      <Title level={2}>Notas</Title>
      <Card className="note-input-card">
        <Input
          size="large"
          className="notes-input"
          value={title} // Usando o estado separado para criação
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
        />
        <ReactQuill
          value={content} // Usando o estado separado para criação
          onChange={setContent}
          modules={{
            toolbar: [
              [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean']
            ],
            clipboard: {
              matchVisual: false,
            },
          }}
          formats={[
            'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'blockquote',
            'color', 'background', 'align', 'link', 'image'
          ]}
          placeholder="Escreva sua nota aqui..."
          className="note-editor"
        />
        <Button
          type="primary"
          size="large"
          onClick={handleAddNote}
          className="add-note-button"
        >
          Adicionar Nota
        </Button>
      </Card>

      <Title level={3} style={{ marginTop: '30px', textAlign: 'center', color: '#2c3e50' }}>
        Minhas Notas
      </Title>
      <div className="notes-list">
        {notes.map((item) => (
          <Card
            key={item.id}
            className="note-card"
            title={item.title}
            extra={<span style={{ color: 'orange' }}>{renderNewStatus(item.expirationDate)}</span>}
          >
            <div className="note-content">
              <div dangerouslySetInnerHTML={{ __html: truncateText(item.content, 100) }} />
            </div>
            <div className="note-footer">
              <Button type="link" onClick={() => showModal(item)}>Ver Mais</Button>
              <span>
                {item.expirationDate
                  ? dayjs(item.expirationDate.seconds * 1000).format('DD/MM/YYYY')
                  : 'Sem data'}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title={currentNote?.title}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="delete" danger onClick={handleDeleteNote}>
            Deletar
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdateNote}>
            Atualizar
          </Button>,
        ]}
      >
        <Input
          value={currentNote?.title || ''}
          onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
          placeholder="Título"
          style={{ marginBottom: 20 }}
        />
        <ReactQuill
          value={currentNote?.content || ''}
          onChange={(content) => setCurrentNote({ ...currentNote, content })}
          modules={{
            toolbar: [
              [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean']
            ],
            clipboard: {
              matchVisual: false,
            },
          }}
          formats={[
            'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'blockquote',
            'color', 'background', 'align', 'link', 'image'
          ]}
          placeholder="Escreva sua nota aqui..."
        />
      </Modal>
    </div>
  );
};

export default Notes;
