import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { addNote, getUserNotes, updateNote, deleteNote } from '../notesService';
import { Button, Modal, Input, DatePicker } from 'antd';
import moment from 'moment';
import './Notes.css';

const Notes = ({ userProfile }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);

  const userId = userProfile.id;

  const modules = {
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
  };

  const formats = [
    'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'color', 'background', 'align', 'link', 'image'
  ];

  const handleAddNote = async () => {
    if (userId && title && content) {
      try {
        const validExpirationDate = expirationDate ? expirationDate.toISOString() : null;
        console.log('Adicionando nota:', { title, content, expirationDate: validExpirationDate, userId });

        await addNote(userId, title, content, validExpirationDate);
        setTitle('');
        setContent('');
        setExpirationDate(null);
        fetchNotes();
      } catch (error) {
        console.error("Erro ao adicionar nota: ", error);
      }
    } else {
      console.error('Dados incompletos: userId, title, content são necessários.');
    }
  };

  const fetchNotes = async () => {
    try {
      const userNotes = await getUserNotes(userId);
      console.log('Notas recuperadas:', userNotes);
      setNotes(userNotes);
    } catch (error) {
      console.error("Erro ao recuperar notas:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const showModal = (note) => {
    setCurrentNote(note);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentNote(null);
  };

  const handleUpdateNote = async () => {
    if (currentNote && currentNote.title && currentNote.content) {
      try {
        const validExpirationDate = currentNote.expirationDate ? currentNote.expirationDate.toISOString() : null;
        console.log('Atualizando nota:', { ...currentNote, expirationDate: validExpirationDate });
        await updateNote(currentNote.id, currentNote.title, currentNote.content, validExpirationDate);
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

  const renderExpirationStatus = (date) => {
    if (!date) {
      return 'Sem data';
    }
    const isExpired = new Date() > new Date(date);
    return isExpired ? 'Expirado' : 'Ativo';
  };

  return (
    <div className="notes-container">
      <h2>Notas</h2>
      <Input
        className="notes-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        style={{ marginBottom: '10px' }}
      />
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        placeholder="Escreva sua nota aqui..."
        style={{ marginBottom: '10px' }}
      />
      <DatePicker
        value={expirationDate}
        onChange={(date) => {
          console.log('Data selecionada:', date);
          setExpirationDate(date);
        }}
        placeholder="Escolha a data de expiração"
        style={{ marginBottom: '20px', display: 'block' }}
      />
      <Button onClick={handleAddNote} type="primary">
        Adicionar Nota
      </Button>

      <h3 style={{ marginTop: '30px' }}>Minhas Notas</h3>
      <div className="notes-list">
        {notes.map((item) => {
          console.log('Renderizando nota:', item);
          return (
            <div className="note-card" key={item.id}>
              <div className="note-title">{item.title}</div>
              <div className="note-content" dangerouslySetInnerHTML={{ __html: item.content }} />
              <div className={`note-status ${renderExpirationStatus(item.expirationDate) === 'Expirado' ? 'expired' : 'active'}`}>
                {renderExpirationStatus(item.expirationDate)}
              </div>
            <div className="note-footer">
            <Button type="link" onClick={() => showModal(item)}>Ver Mais</Button>
            <span>
                {item.expirationDate 
                ? moment(item.expirationDate.toDate()).format('DD/MM/YYYY') 
                : 'Sem data'}
            </span>
            </div>

            </div>
          );
        })}
      </div>

      <Modal
        title={currentNote?.title}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="delete" type="danger" onClick={handleDeleteNote}>
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
          value={currentNote?.title}
          onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
          placeholder="Título"
          style={{ marginBottom: 20 }}
        />
        <ReactQuill
          value={currentNote?.content}
          onChange={(content) => setCurrentNote({ ...currentNote, content })}
          modules={modules}
          formats={formats}
          placeholder="Escreva sua nota aqui..."
        />
        <DatePicker
          value={currentNote?.expirationDate ? new Date(currentNote.expirationDate) : null}
          onChange={(date) => {
            console.log('Atualizando data:', date);
            setCurrentNote({ ...currentNote, expirationDate: date });
          }}
          placeholder="Escolha a data de expiração"
          style={{ marginTop: '20px', display: 'block' }}
        />
      </Modal>
    </div>
  );
};

export default Notes;
