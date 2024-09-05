const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 4000;

// Criar o servidor HTTP
const server = http.createServer(app);

// Inicializar o Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Permitir qualquer origem, ou configure o domínio específico
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Configuração de conexão com MySQL
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'chat_db'
});

// Verificar conexão com o banco de dados
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

// Socket.IO - Escutar novas conexões
io.on('connection', (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  // Escutar o evento para entrar em um chat
  socket.on('join_chat', (chat_id) => {
    socket.join(chat_id); // Usuário entra na sala do chat
    console.log(`Usuário entrou no chat: ${chat_id}`);
  });


// Escutar evento de envio de mensagem
socket.on('send_message', (data) => {
    const { chat_id, sender_id, receiver_id, text } = data;
    
    // Salvar a mensagem no banco de dados
    const query = `INSERT INTO messages (chat_id, sender_id, receiver_id, text) VALUES (?, ?, ?, ?)`;
    db.query(query, [chat_id, sender_id, receiver_id, text], (err, result) => {
        if (err) {
            console.error('Erro ao enviar mensagem:', err);
            return;
        }

        // Emitir a mensagem de volta para o chat específico
        io.to(chat_id).emit('receive_message', {
            chat_id,
            sender_id,
            receiver_id,
            text,
            id: result.insertId,
        });
    });
});

  
  

  // Desconexão de clientes
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

// Rota para criar ou atualizar um usuário (evita duplicação de e-mail)
app.post('/users', (req, res) => {
  const { username, email, password, profilePicUrl, isOnline, Cargo1, lastActiveAt, companies, empresa } = req.body;

  // Validação de dados
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios não fornecidos.' });
  }

  const query = `
    INSERT INTO users (username, email, password, profilePicUrl, isOnline, Cargo1, lastActiveAt, companies, empresa)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      username = VALUES(username),
      password = VALUES(password),
      profilePicUrl = VALUES(profilePicUrl),
      isOnline = VALUES(isOnline),
      Cargo1 = VALUES(Cargo1),
      lastActiveAt = VALUES(lastActiveAt),
      companies = VALUES(companies),
      empresa = VALUES(empresa)
  `;
  
  db.execute(query, [username, email, password, profilePicUrl, isOnline, Cargo1, lastActiveAt, JSON.stringify(companies), empresa], (err, results) => {
    if (err) {
      console.error('Erro ao inserir ou atualizar usuário:', err);
      return res.status(500).json({ error: 'Erro ao inserir ou atualizar usuário' });
    }
    res.status(201).json({ message: 'Usuário inserido ou atualizado com sucesso', id: results.insertId });
  });
});

// Rota para buscar todos os usuários
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Rota para buscar um usuário específico pelo ID
app.get('/users/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).send(err);
    }
    res.json(results[0]);
  });
});

// Rota para criar uma nova mensagem
app.post('/messages', (req, res) => {
  const { chat_id, sender_id, receiver_id, text } = req.body;

  // Validação de dados
  if (!chat_id || !sender_id || !receiver_id || !text) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const query = `INSERT INTO messages (chat_id, sender_id, receiver_id, text) VALUES (?, ?, ?, ?)`;
  db.query(query, [chat_id, sender_id, receiver_id, text], (err, result) => {
    if (err) {
      console.error('Erro ao enviar mensagem:', err);
      return res.status(500).send(err);
    }
    res.status(201).json({ id: result.insertId });
  });
});

// Rota para buscar mensagens de um chat específico
app.get('/chats/:chatId/messages', (req, res) => {
  const query = `SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC`;
  db.query(query, [req.params.chatId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar mensagens:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Endpoint para encontrar ou criar um chat entre dois usuários
app.get('/chats/findOrCreate', (req, res) => {
  const { user1, user2 } = req.query;

  // Precisamos buscar os IDs dos usuários no banco de dados
  const findUser1Query = 'SELECT id FROM users WHERE username = ?';
  const findUser2Query = 'SELECT id FROM users WHERE username = ?';

  db.query(findUser1Query, [user1], (err1, user1Results) => {
    if (err1 || user1Results.length === 0) {
      console.error('Erro ao buscar user1:', err1);
      return res.status(500).json({ error: 'Erro ao buscar user1' });
    }

    db.query(findUser2Query, [user2], (err2, user2Results) => {
      if (err2 || user2Results.length === 0) {
        console.error('Erro ao buscar user2:', err2);
        return res.status(500).json({ error: 'Erro ao buscar user2' });
      }

      const user1Id = user1Results[0].id;
      const user2Id = user2Results[0].id;

      // Gera um chat_id único baseado nos IDs dos usuários
      const chatId = user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;

      // Verifica se o chat já existe no banco de dados
      const query = 'SELECT * FROM chats WHERE chat_id = ?';
      db.query(query, [chatId], (err, results) => {
        if (err) {
          console.error('Erro ao verificar chat:', err);
          return res.status(500).json({ error: 'Erro ao verificar chat' });
        }

        if (results.length === 0) {
          // Se o chat não existir, cria um novo
          const createChatQuery = 'INSERT INTO chats (chat_id, user1_id, user2_id) VALUES (?, ?, ?)';
          db.query(createChatQuery, [chatId, user1Id, user2Id], (err, result) => {
            if (err) {
              console.error('Erro ao criar chat:', err);
              return res.status(500).json({ error: 'Erro ao criar chat' });
            }
            res.json({ chatId });
          });
        } else {
          // Se o chat já existir, retorna o `chat_id`
          res.json({ chatId });
        }
      });
    });
  });
});

// Rota para buscar todos os usuários online (exceto o próprio usuário)
app.get('/users/online', (req, res) => {
    const { userId } = req.query; // Supondo que o userId seja passado como query param
  
    // Filtrar todos os usuários que estão online, exceto o próprio usuário
    const query = 'SELECT * FROM users WHERE isOnline = 1 AND id != ?';
    
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuários online:', err);
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });

// Iniciar o servidor na porta especificada
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
