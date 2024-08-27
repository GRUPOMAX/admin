import React, { useEffect, useState } from 'react';
import { Table, Tabs, message, Spin, Pagination, Select, Button } from 'antd';
import { ReloadOutlined, ToolOutlined, CarOutlined } from '@ant-design/icons';
import axios from 'axios';
import './styles/OrdensServicoDashboard.css';

const { TabPane } = Tabs;
const { Option } = Select;

const OrdensServicoDashboard = () => {
  const [agendadas, setAgendadas] = useState([]);
  const [emExecucao, setEmExecucao] = useState([]);
  const [emAberto, setEmAberto] = useState([]);
  const [emAnalise, setEmAnalise] = useState([]);
  const [encaminhadas, setEncaminhadas] = useState([]);
  const [reagendadas, setReagendadas] = useState([]);
  const [emDeslocamento, setEmDeslocamento] = useState([]);
  const [finalizadas, setFinalizadas] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingFinalizadas, setLoadingFinalizadas] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Instalação');
  const [appliedFilters, setAppliedFilters] = useState({
    status: '',
    technician: '',
    subject: 'Instalação',
  });

  // Armazena a lista de técnicos e assuntos disponíveis para os filtros
  const [technicians, setTechnicians] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Estado para gerenciar o botão e o temporizador
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(
    Number(localStorage.getItem('timeRemaining')) || 0
  );

  // Estado para o ícone de ferramenta verde piscando
  const [hasExecutionOrders, setHasExecutionOrders] = useState(false);
  // Estado para o ícone do carro piscando
  const [hasDeslocamentoOrders, setHasDeslocamentoOrders] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          agendadasData,
          emExecucaoData,
          emAbertoData,
          emAnaliseData,
          encaminhadasData,
          reagendadasData,
          emDeslocamentoData,
        ] = await Promise.all([
          axios.get('https://apidoixc.nexusnerds.com.br/Data/Ordens_Agendadas.json'),
          axios.get('https://apidoixc.nexusnerds.com.br/Data/Ordens_Em_Execucao.json'),
          axios.get('https://apidoixc.nexusnerds.com.br/Data/Ordens_Em_Aberto.json'),
          axios.get('https://apidoixc.nexusnerds.com.br/Data/Ordens_Em_Analise.json'),
          axios.get('https://apidoixc.nexusnerds.com.br/Data/Ordens_Encaminhadas.json'),
          axios.get('https://apidoixc.nexusnerds.com.br/Data/Ordens_Reagendadas.json'),
          axios.get('https://apidoixc.nexusnerds.com.br/Data/Ordens_Em_Deslocamento.json'),
        ]);

        setAgendadas(agendadasData.data);
        setEmExecucao(emExecucaoData.data);
        setEmAberto(emAbertoData.data);
        setEmAnalise(emAnaliseData.data);
        setEncaminhadas(encaminhadasData.data);
        setReagendadas(reagendadasData.data);
        setEmDeslocamento(emDeslocamentoData.data);

        // Verifica se há ordens em execução para exibir o ícone de ferramenta verde piscando
        setHasExecutionOrders(emExecucaoData.data.length > 0);
        // Verifica se há ordens em deslocamento para exibir o ícone de carro laranja piscando
        setHasDeslocamentoOrders(emDeslocamentoData.data.length > 0);

        // Extrai os técnicos e assuntos únicos para os filtros
        const allTechnicians = [
          ...new Set([
            ...agendadasData.data,
            ...emExecucaoData.data,
            ...emAbertoData.data,
            ...emAnaliseData.data,
            ...encaminhadasData.data,
            ...reagendadasData.data,
            ...emDeslocamentoData.data,
          ].map((item) => item.tecnico)),
        ];

        const allSubjects = [
          ...new Set([
            ...agendadasData.data,
            ...emExecucaoData.data,
            ...emAbertoData.data,
            ...emAnaliseData.data,
            ...encaminhadasData.data,
            ...reagendadasData.data,
            ...emDeslocamentoData.data,
          ].map((item) => item.assunto)),
        ];

        setTechnicians(allTechnicians);
        setSubjects(allSubjects);

        setLoading(false);
      } catch (error) {
        message.error('Erro ao carregar os dados das ordens de serviço.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isButtonDisabled && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          localStorage.setItem('timeRemaining', newTime);

          if (newTime <= 0) {
            clearInterval(interval);
            setIsButtonDisabled(false);
            localStorage.removeItem('timeRemaining');
          }

          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isButtonDisabled, timeRemaining]);

  const handleCustomCommand = async (command) => {
    setIsButtonDisabled(true);
    setTimeRemaining(60);
    localStorage.setItem('timeRemaining', 60);

    try {
      await executeCommand(command);
      message.success('Comando executado com sucesso!');
    } catch (error) {
      console.error('Erro ao executar o comando:', error);
      message.error('Erro ao executar o comando.');
    }
  };

  const executeCommand = async (command) => {
    try {
      const response = await fetch('https://api.comand.nexusnerds.com.br/executar-comando', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comando: command }),
      });

      if (!response.ok) {
        throw new Error('Erro ao executar o comando');
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(`Erro de execução: ${error.message}`);
      throw error;
    }
  };

  const fetchFinalizadas = async () => {
    setLoadingFinalizadas(true);
    try {
      const finalizadasData = await axios.get('https://apidoixc.nexusnerds.com.br/Data/Ordens_Finalizadas.json');
      setFinalizadas(finalizadasData.data);
      setLoadingFinalizadas(false);
    } catch (error) {
      message.error('Erro ao carregar os dados das ordens finalizadas.');
      setLoadingFinalizadas(false);
    }
  };

  const columns = [
    {
      title: 'Técnico',
      dataIndex: 'tecnico',
      key: 'tecnico',
    },
    {
      title: 'Cliente',
      dataIndex: 'razao',
      key: 'razao',
    },
    {
      title: 'Endereço',
      dataIndex: 'endereco',
      key: 'endereco',
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone_celular',
      key: 'telefone_celular',
    },
    {
      title: 'Data Abertura',
      dataIndex: 'data_abertura',
      key: 'data_abertura',
    },
    {
      title: 'Data Final',
      dataIndex: 'data_final',
      key: 'data_final',
    },
    {
      title: 'Assunto',
      dataIndex: 'assunto',
      key: 'assunto',
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const applyFilters = () => {
    setAppliedFilters({
      status: selectedStatus,
      technician: selectedTechnician,
      subject: selectedSubject,
    });
  };

  const paginatedData = (data) => {
    const filteredData = data.filter((item) =>
      (appliedFilters.status ? item.status === appliedFilters.status : true) &&
      (appliedFilters.technician ? item.tecnico === appliedFilters.technician : true) &&
      (appliedFilters.subject ? item.assunto === appliedFilters.subject : true)
    );

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  };

  const renderFinalizadas = () => {
    if (loadingFinalizadas) {
      return <Spin size="large" tip="Carregando ordens finalizadas..." />;
    }

    if (!selectedMonth) {
      return <p>Selecione um mês para visualizar as ordens finalizadas.</p>;
    }

    const ordensDoMes = finalizadas[selectedMonth] || [];
    return (
      <>
        <Table
          columns={columns}
          dataSource={paginatedData(ordensDoMes)}
          rowKey="id_cliente"
          pagination={false} // Desativa a paginação interna da tabela
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={ordensDoMes.length}
          onChange={handlePageChange}
          style={{ marginTop: 20, textAlign: 'center' }}
        />
      </>
    );
  };

  const handleTabChange = (key) => {
    if (key === '6') {
      fetchFinalizadas();
    }
  };

  return (
    <div className="ordens-servico-dashboard-container">
      <h2>Dashboard - Ordens de Serviço</h2>
      <div className="filter-container">
        <Select
          placeholder="Filtrar por status"
          onChange={(value) => setSelectedStatus(value)}
          style={{ width: 200, marginRight: 10 }}
        >
          <Option value="">Todos os status</Option>
          <Option value="Agendadas">Agendadas</Option>
          <Option value="EmExecucao">Em Execução</Option>
          <Option value="EmAberto">Em Aberto</Option>
          <Option value="EmAnalise">Em Análise</Option>
          <Option value="Encaminhadas">Encaminhadas</Option>
          <Option value="Reagendadas">Reagendadas</Option>
          <Option value="EmDeslocamento">Em Deslocamento</Option>
          <Option value="Finalizadas">Finalizadas</Option>
        </Select>
        <Select
          placeholder="Filtrar por técnico"
          onChange={(value) => setSelectedTechnician(value)}
          style={{ width: 200, marginRight: 10 }}
        >
          <Option value="">Todos os técnicos</Option>
          {technicians.map((tecnico) => (
            <Option key={tecnico} value={tecnico}>
              {tecnico}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por assunto"
          value={selectedSubject} // Mantém o valor pré-selecionado "Instalação"
          onChange={(value) => setSelectedSubject(value)}
          style={{ width: 200, marginRight: 10 }}
        >
          <Option value="">Todos os assuntos</Option>
          {subjects.map((assunto) => (
            <Option key={assunto} value={assunto}>
              {assunto}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={applyFilters}>
          Aplicar Filtros
        </Button>
      </div>
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <TabPane
          tab={
            <span>
              Em Execução {hasExecutionOrders && <ToolOutlined className="blinking-tool-icon" />}
            </span>
          }
          key="2"
        >
          <Table
            columns={columns}
            dataSource={paginatedData(emExecucao)}
            rowKey="id_cliente"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={emExecucao.length}
            onChange={handlePageChange}
            style={{ marginTop: 20, textAlign: 'center' }}
          />
        </TabPane>
        <TabPane tab="Agendadas" key="1">
          <Table
            columns={columns}
            dataSource={paginatedData(agendadas)}
            rowKey="id_cliente"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={agendadas.length}
            onChange={handlePageChange}
            style={{ marginTop: 20, textAlign: 'center' }}
          />
        </TabPane>
        <TabPane tab="Em Aberto" key="3">
          <Table
            columns={columns}
            dataSource={paginatedData(emAberto)}
            rowKey="id_cliente"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={emAberto.length}
            onChange={handlePageChange}
            style={{ marginTop: 20, textAlign: 'center' }}
          />
        </TabPane>
        <TabPane tab="Em Análise" key="4">
          <Table
            columns={columns}
            dataSource={paginatedData(emAnalise)}
            rowKey="id_cliente"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={emAnalise.length}
            onChange={handlePageChange}
            style={{ marginTop: 20, textAlign: 'center' }}
          />
        </TabPane>
        <TabPane tab="Encaminhadas" key="5">
          <Table
            columns={columns}
            dataSource={paginatedData(encaminhadas)}
            rowKey="id_cliente"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={encaminhadas.length}
            onChange={handlePageChange}
            style={{ marginTop: 20, textAlign: 'center' }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              Em Deslocamento {hasDeslocamentoOrders && <CarOutlined className="blinking-car-icon" />}
            </span>
          }
          key="8"
        >
          <Table
            columns={columns}
            dataSource={paginatedData(emDeslocamento)}
            rowKey="id_cliente"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={emDeslocamento.length}
            onChange={handlePageChange}
            style={{ marginTop: 20, textAlign: 'center' }}
          />
        </TabPane>
        <TabPane tab="Reagendadas" key="7">
          <Table
            columns={columns}
            dataSource={paginatedData(reagendadas)}
            rowKey="id_cliente"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={reagendadas.length}
            onChange={handlePageChange}
            style={{ marginTop: 20, textAlign: 'center' }}
          />
        </TabPane>
        <TabPane tab="Finalizadas" key="6">
          <div>
            <h3>Selecione o mês:</h3>
            <Select
              onChange={(value) => setSelectedMonth(value)}
              value={selectedMonth}
              style={{ width: 200 }}
            >
              <Option value="">Selecione um mês</Option>
              {Object.keys(finalizadas).map((mes) => (
                <Option key={mes} value={mes}>
                  {mes}
                </Option>
              ))}
            </Select>
          </div>
          {renderFinalizadas()}
        </TabPane>
      </Tabs>
      <Button
        type="primary"
        onClick={() => handleCustomCommand('node /api_ixc/dashboard/updateData.js && node /api_ixc/dashboard/analisarAssuntos.js && node /api_ixc/dashboard/gerarRelatorioChamados.js && node /api_ixc/dashboard/gerarOrdensPorStatus.js')}
        disabled={isButtonDisabled}
        icon={<ReloadOutlined />}
        style={{ marginTop: 20 }}
      >
        {isButtonDisabled ? `Aguarde ${timeRemaining}s` : 'Atualizar Lista'}
      </Button>
    </div>
  );
};

export default OrdensServicoDashboard;
