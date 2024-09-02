import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, List, DatePicker, Select, Tag, Checkbox } from 'antd';
import { 
  addTaskToList, 
  getTasksFromList, 
  updateTask, 
  deleteTask 
} from '../tasksService';
import dayjs from 'dayjs';
import axios from 'axios';
import './Tasks.css';

const { Option } = Select;

const Tasks = ({ userProfile }) => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskExpirationDate, setNewTaskExpirationDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isPersonalTask, setIsPersonalTask] = useState(false); // Estado para o checkbox "Tarefa Pessoal"

  const userId = userProfile?.id;
  const userName = userProfile?.name;

  useEffect(() => {
    if (userId) {
      fetchTasks();
      fetchUsers();
    }
  }, [userId]);

  const fetchTasks = async () => {
    console.log('Carregando tarefas...');
    const tasks = await getTasksFromList(userId);
    console.log('Tarefas carregadas:', tasks);
    setTasks(tasks);
  };

  const fetchUsers = async () => {
    try {
      console.log('Carregando usuários...');
      const { data } = await axios.get('https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records', {
        headers: {
          'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5',
        },
      });
      // Remove o próprio usuário da lista de destinatários
      const filteredUsers = data.list.filter(user => user.name !== userName);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle) {
      console.warn('Título da tarefa ausente.');
      return;
    }

    try {
      const senderName = isPersonalTask ? 'Tarefa Pessoal' : userProfile?.name || 'Desconhecido';
      let recipientNames = '';

      // Define recipientNames como "Tarefa Pessoal" se for uma tarefa pessoal
      if (isPersonalTask) {
        recipientNames = 'Tarefa Pessoal';
      } else {
        // Constrói uma string com os nomes dos destinatários
        if (selectedUserIds.length > 0) {
          recipientNames = selectedUserIds
            .map(id => users.find(user => user.Id === id)?.name || 'Desconhecido')
            .join(', ');
        }
      }

      const taskData = {
        title: newTaskTitle,
        description: newTaskDescription || '',
        userId: userId,
        createdAt: new Date(),
        completed: false,
        senderName: senderName,
        isSender: true,
        expirationDate: newTaskExpirationDate ? dayjs(newTaskExpirationDate).toISOString() : null,
        recipientNames: recipientNames || 'Desconhecido'
      };

      console.log('Dados da tarefa antes de enviar ao Firebase:', JSON.stringify(taskData, null, 2));

      // Adiciona a tarefa ao Firebase
      const taskId = await addTaskToList(
        userId,
        taskData.title,
        taskData.description,
        undefined, 
        taskData.expirationDate,
        taskData.senderName,
        taskData.isSender,
        taskData.recipientNames
      );
      console.log('Tarefa criada com ID:', taskId);

      // Se não for uma tarefa pessoal, encaminha a tarefa para os destinatários
      if (!isPersonalTask && selectedUserIds.length > 0) {
        for (const recipientUserId of selectedUserIds) {
          const selectedUserName = users.find(user => user.Id === recipientUserId)?.name || 'Desconhecido';
          console.log('Tarefa encaminhada para o usuário:', selectedUserName);

          await addTaskToList(
            recipientUserId,
            `Tarefa Encaminhada: ${newTaskTitle}`,
            taskData.description,
            undefined,
            taskData.expirationDate,
            taskData.senderName,
            false,
            recipientNames
          );
        }
      }

      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskExpirationDate(null);
      setSelectedUserIds([]);
      setIsPersonalTask(false); // Reseta o estado do checkbox
      fetchTasks();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleCompleteTask = async (task) => {
    console.log('Concluindo tarefa:', task);
    await updateTask(task.id, { completed: true });
    fetchTasks();
  };

  const handleDeleteTask = async (taskId) => {
    console.log('Excluindo tarefa ID:', taskId);
    await deleteTask(taskId);
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'sent') return task.isSender === true;
    if (filter === 'received') return task.isSender === false;
    return true;
  });

  const renderTaskItem = (task) => {
    const isSender = task.isSender;

    return (
      <List.Item>
        <div className="task-item">
          <div>
            <h4>{task.title}</h4>
            <p>{task.description || 'Sem descrição'}</p>
            <p>Data de Expiração: {task.expirationDate ? dayjs(task.expirationDate).format('DD/MM/YYYY') : 'Nenhuma'}</p>
            {isSender ? (
              <p>Enviado para: {task.recipientNames || 'Desconhecido'}</p>
            ) : (
              <p>Recebido de: {task.senderName || 'Desconhecido'}</p>
            )}
            {task.completed && <Tag color="green">Concluída</Tag>}
            {!task.completed && <Tag color="red">Pendente</Tag>}
          </div>
          <div className="task-actions">
            {!task.completed && (
              <Button onClick={() => handleCompleteTask(task)}>
                Concluir
              </Button>
            )}
            <Button type="danger" onClick={() => handleDeleteTask(task.id)}>
              Deletar
            </Button>
          </div>
        </div>
      </List.Item>
    );
  };

  return (
<div className="tasks-container">
  <div className="tasks-header">
    <h2>Minhas Tarefas</h2>
    <Button type="primary" onClick={() => setIsModalVisible(true)}>
      Adicionar Tarefa
    </Button>
    <Select value={filter} onChange={setFilter} style={{ width: 200, marginLeft: '1rem' }}>
      <Option value="all">Todas</Option>
      <Option value="pending">Pendentes</Option>
      <Option value="completed">Concluídas</Option>
      <Option value="sent">Enviadas</Option>
      <Option value="received">Recebidas</Option>
    </Select>
  </div>

  <List
    bordered
    dataSource={filteredTasks}
    renderItem={renderTaskItem}
  />

  <Modal
    title="Adicionar Nova Tarefa"
    visible={isModalVisible}
    onCancel={() => setIsModalVisible(false)}
    onOk={handleAddTask}
    className="tasks-modal" // Caso deseje aplicar estilos adicionais específicos ao modal
  >
    <Input
      value={newTaskTitle}
      onChange={(e) => setNewTaskTitle(e.target.value)}
      placeholder="Título da Tarefa"
      style={{ marginBottom: '1rem' }}
    />
    <Input.TextArea
      value={newTaskDescription}
      onChange={(e) => setNewTaskDescription(e.target.value)}
      placeholder="Descrição da Tarefa"
      style={{ marginBottom: '1rem' }}
    />
    <DatePicker
      value={newTaskExpirationDate ? dayjs(newTaskExpirationDate) : null}
      onChange={(date) => setNewTaskExpirationDate(date ? date.toDate() : null)}
      placeholder="Escolha a data de expiração"
      style={{ marginBottom: '1rem', display: 'block' }}
    />
    <Checkbox
      checked={isPersonalTask}
      onChange={(e) => setIsPersonalTask(e.target.checked)}
      style={{ marginBottom: '1rem' }}
    >
      Tarefa Pessoal
    </Checkbox>
    {!isPersonalTask && (
      <Select
        mode="multiple"
        placeholder="Encaminhar para usuários"
        value={selectedUserIds}
        onChange={setSelectedUserIds}
        style={{ width: '100%' }}
      >
        {users.map(user => (
          <Option key={user.Id} value={user.Id}>
            {user.name}
          </Option>
        ))}
      </Select>
    )}
  </Modal>
</div>

  );
};

export default Tasks;
