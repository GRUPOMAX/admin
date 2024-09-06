import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layout, Menu, Typography, message, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import './Sidebar.css';

dayjs.locale('pt-br'); // Configura o dayjs para usar o português

const { Sider } = Layout;
const { Title, Text } = Typography;

const Sidebar = ({ onLogout, userName }) => { 
  const [nextBirthday, setNextBirthday] = useState(null); // Estado para o próximo aniversário
  const [nextHoliday, setNextHoliday] = useState(null); // Estado para o próximo feriado
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [loadingBirthdays, setLoadingBirthdays] = useState(true);
  const [isBirthdayModalVisible, setIsBirthdayModalVisible] = useState(false); // Estado para controlar o modal
  const location = useLocation();

  useEffect(() => {
    // Função para buscar feriados e aniversários
    const fetchHolidaysAndBirthdays = async () => {
      if (!nextHoliday) await fetchHolidays();  // Busca os feriados
      if (!nextBirthday) await fetchUserBirthdays();  // Busca os aniversários
    };

    fetchHolidaysAndBirthdays();
  }, [nextHoliday, nextBirthday]);

  // Função para buscar feriados
  const fetchHolidays = async () => {
    setLoadingHolidays(true);
    try {
      const response = await axios.get('https://apidoixc.nexusnerds.com.br/Data/feriados.json');
      const holidaysData = response.data;
      findNextHoliday(holidaysData);
    } catch (error) {
      message.error('Erro ao carregar os feriados');
    } finally {
      setLoadingHolidays(false);
    }
  };

  // Função para encontrar o próximo feriado
  const findNextHoliday = (holidays) => {
    const today = dayjs();
    const upcomingHolidays = Object.keys(holidays)
      .filter(date => dayjs(date).isAfter(today))
      .sort((a, b) => (dayjs(a).isBefore(dayjs(b)) ? -1 : 1));

    if (upcomingHolidays.length > 0) {
      const nextHolidayDate = upcomingHolidays[0];
      setNextHoliday({
        date: nextHolidayDate,
        name: holidays[nextHolidayDate],
        dayOfWeek: dayjs(nextHolidayDate).format('dddd'),
      });
    } else {
      setNextHoliday(null); // Nenhum próximo feriado
    }
  };

  // Função para buscar os aniversários dos usuários
  const fetchUserBirthdays = async () => {
    setLoadingBirthdays(true);
    try {
      const response = await axios.get('https://nocodb.nexusnerds.com.br/api/v2/tables/m0wcogamwt1qc5e/records', {
        headers: {
          'xc-token': 'ZqFzoCRvPCyzSRAIKPMbnOaLwR6laivSdxcpXiA5', // Usar variável de ambiente para token
        },
      });

      const users = response.data.list;
      findNextBirthday(users);
    } catch (error) {
      message.error('Erro ao carregar os aniversários dos usuários');
    } finally {
      setLoadingBirthdays(false);
    }
  };

  // Função para calcular o próximo aniversário de todos os usuários
  const findNextBirthday = (users) => {
    const today = dayjs();

    // Mapeia para encontrar o próximo aniversário de cada usuário
    const upcomingBirthdays = users
      .filter(user => user.nascimento) // Filtra apenas usuários com data de nascimento
      .map(user => {
        const birthDate = dayjs(user.nascimento);
        let nextBirthday = birthDate.year(today.year());

        // Verifica se o aniversário já passou este ano, se sim, ajusta para o próximo ano
        if (nextBirthday.isBefore(today, 'day')) {
          nextBirthday = birthDate.year(today.year() + 1);
        }

        // Retorna os dados do próximo aniversário
        return {
          name: user.name,
          date: nextBirthday,
          formattedDate: nextBirthday.format('DD/MM/YYYY'),
          dayOfWeek: nextBirthday.format('dddd'),
          isToday: nextBirthday.isSame(today, 'day'), // Verifica se o aniversário é hoje
        };
      })
      .sort((a, b) => (a.date.isBefore(b.date) ? -1 : 1)); // Ordenar pela data

    const todayBirthday = upcomingBirthdays.find(birthday => birthday.isToday);

    if (todayBirthday) {
      setNextBirthday(todayBirthday); // Se houver aniversário hoje, exibe
      if (todayBirthday.name === userName) { // Exibe o modal apenas se o aniversariante for o usuário logado
        checkAndShowBirthdayModal(todayBirthday.name); // Verifica se o modal já foi mostrado
      }
    } else if (upcomingBirthdays.length > 0) {
      setNextBirthday(upcomingBirthdays[0]); // O mais próximo
    } else {
      setNextBirthday(null);
    }
  };

  // Função para verificar e exibir o modal de aniversário
  const checkAndShowBirthdayModal = (name) => {
    const todayDate = dayjs().format('YYYY-MM-DD'); // Obtém a data atual formatada

    // Verifica se já foi mostrado hoje
    const modalShown = localStorage.getItem(`birthdayModalShown_${todayDate}`);
    if (!modalShown) {
      showBirthdayModal(name); // Exibe o modal
      localStorage.setItem(`birthdayModalShown_${todayDate}`, 'true'); // Define que foi mostrado hoje
    }
  };

  // Função para exibir o modal de aniversário
  const showBirthdayModal = (name) => {
    setIsBirthdayModalVisible(true);
  };

  // Função para fechar o modal de aniversário
  const handleBirthdayModalClose = () => {
    setIsBirthdayModalVisible(false);
  };

  const menuOptions = {
    '/home/max-fibra': [
      { name: 'Dashboard', href: '/home/home' },
      { name: 'Consulta CNPJ', href: '/home/max-fibra/consultaCNPJ' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },
    ],
    // Outros itens de menu...
  };

  const currentPath = location.pathname;
  const options = menuOptions[currentPath] || [];

  const handleLogout = () => {
    onLogout();
    window.location.reload();
  };

  return (
    <Sider className="sidebar" width={250} theme="light">
      <div className="sidebar-content">
        <div className="dynamic-menu">
          {options.length > 0 && (
            <>
              <Title level={4}>Menu</Title>
              <Menu mode="inline" selectedKeys={[currentPath]}>
                {options.map((option, index) => (
                  <Menu.Item key={option.href}>
                    <Link to={option.href}>{option.name}</Link>
                  </Menu.Item>
                ))}
              </Menu>
            </>
          )}
        </div>
        <div className="next-holiday-container">
          <Title level={4}>Próximo Feriado</Title>
          {loadingHolidays ? (
            <p>Carregando...</p>
          ) : nextHoliday ? (
            <Text>
              {nextHoliday.name} em <strong>{dayjs(nextHoliday.date).format('DD/MM/YYYY')}</strong> ({nextHoliday.dayOfWeek})
            </Text>
          ) : (
            <Text>Não há próximos feriados.</Text>
          )}
        </div>
        <div className="next-birthday-container">
          {/* Se o aniversário for hoje, mostrar "Aniversariante do Dia" */}
          <Title level={4}>{nextBirthday?.isToday ? 'Aniversariante do Dia' : 'Próximo Aniversário'}</Title>
          {loadingBirthdays ? (
            <Text>Carregando aniversários...</Text>
          ) : nextBirthday ? (
            <Text>
              {/* Se o aniversário for hoje, mostrar mensagem especial */}
              {nextBirthday.isToday ? (
                <span>Hoje é o aniversário de <strong>{nextBirthday.name}</strong>! 🎉</span>
              ) : (
                <span>
                  Próximo aniversário de <strong>{nextBirthday.name}</strong> será em <strong>{nextBirthday.formattedDate}</strong> ({nextBirthday.dayOfWeek})
                </span>
              )}
            </Text>
          ) : (
            <Text>Não há próximos aniversários.</Text>
          )}
        </div>

        {/* Modal de aniversário */}
        <Modal
          title="Feliz Aniversário!"
          visible={isBirthdayModalVisible}
          onOk={handleBirthdayModalClose}
          onCancel={handleBirthdayModalClose}
          okText="Obrigado"
          cancelText="Fechar"
        >
          <p>Parabéns, {nextBirthday?.name}! 🎉🎂🎈 Nós, do Grupo Max, desejamos a você um dia extraordinário, repleto de alegrias e conquistas! 🥳🎉</p>

        </Modal>
      </div>
    </Sider>
  );
};

export default Sidebar;
