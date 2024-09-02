import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import './Sidebar.css'

dayjs.locale('pt-br');  // Configura o dayjs para usar o português

const { Sider } = Layout;
const { Title, Text } = Typography;

const Sidebar = ({ onLogout }) => {
  const [holidays, setHolidays] = useState({});
  const [nextHoliday, setNextHoliday] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHolidays = async () => {
      const cachedHolidays = localStorage.getItem('holidays-data');

      if (cachedHolidays) {
        const holidaysData = JSON.parse(cachedHolidays);
        setHolidays(holidaysData);
        findNextHoliday(holidaysData);
        setLoading(false);
      } else {
        try {
          const response = await axios.get(
            'https://apidoixc.nexusnerds.com.br/Data/feriados.json'
          );

          const holidaysData = response.data;
          console.log('Dados recebidos da API:', holidaysData);

          localStorage.setItem('holidays-data', JSON.stringify(holidaysData));
          setHolidays(holidaysData);
          findNextHoliday(holidaysData);

          setLoading(false);
        } catch (error) {
          message.error('Erro ao carregar os feriados');
          setLoading(false);
        }
      }
    };

    fetchHolidays();
  }, []);

  const findNextHoliday = (holidays) => {
    const today = dayjs();
    const upcomingHolidays = Object.keys(holidays)
      .filter(date => dayjs(date).isAfter(today))
      .sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);

    if (upcomingHolidays.length > 0) {
      const nextHolidayDate = upcomingHolidays[0];
      setNextHoliday({
        date: nextHolidayDate,
        name: holidays[nextHolidayDate],
        dayOfWeek: dayjs(nextHolidayDate).format('dddd'),
      });
    } else {
      setNextHoliday(null);  // Nenhum próximo feriado
    }
  };

  const menuOptions = {
    '/home/max-fibra': [
      { name: 'Dashboard', href: '/home/home' },
      { name: 'Consulta CNPJ', href: '/home/max-fibra/consultaCNPJ' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },
    ],
    '/home/vir-telecom': [
      { name: 'Dashboard Vir Telecom', href: '/home/vir-telecom/Dashboard-virtelecom' },
      { name: 'Consultar CNPJ', href: '/home/vir-telecom/consultaCNPJ' }, // Ajustado para ser específico para /home/vir-telecom
    ],
    '/home/reis-services': [
      { name: 'Opção 1 - Reis', href: '/reis-services/opcao1' },
      { name: 'Opção 2 - Reis', href: '/reis-services/opcao2' },
    ],
    '/home/max-fibra/consultaCNPJ': [
      { name: 'Dashboard', href: '/home/max-fibra' },
      { name: 'Max Fibra - Atalhos', href: '/home/max-fibra' },
      { name: 'Consulta CPF', href: '/home/max-fibra/consultaCPF' },
    ],
    '/home/max-fibra/consultaCPF': [
      { name: 'Pagina Inicial', href: '/home/max-fibra' },
      { name: 'Consulta CNPJ', href: '/home/max-fibra/consultaCNPJ' },
    ],
    '/home/max-fibra/cadastro': [
      { name: 'Pagina Inicial', href: '/home/max-fibra' },
    ],
    '/home/vir-telecom/Dashboard-virtelecom': [
      { name: 'Atalhos Vir Telecom', href: '/home/vir-telecom' },
    ], 
    '/home': [
      { name: 'Max Fibra', href: '/home/max-fibra' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },
    ],
    '/home/editar-perfil': [
      { name: 'Dashboard', href: '/home' },
      { name: 'Max Fibra', href: '/home/max-fibra' },
    ],
    '/home/criar-usuario': [
      { name: 'Dashboard', href: '/home' },
      { name: 'Max Fibra', href: '/home/max-fibra' },
    ],
    '/home/gerenciar-atalhos': [
      { name: 'Dashboard', href: '/home' },
      { name: 'Max Fibra', href: '/home/max-fibra' },
    ],
    '/home/detalhes-dispositivos': [
      { name: 'Dashboard', href: '/home' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },
    ],
    '/home/home': [
      { name: 'Max Fibra', href: '/home/max-fibra' },
      { name: 'Cadastro Vendedor', href: '/home/max-fibra/cadastro' },
    ],
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
          {loading ? (
            <p>Carregando...</p>
          ) : nextHoliday ? (
            <Text>
             {nextHoliday.name} em <strong>{dayjs(nextHoliday.date).format('DD/MM/YYYY')}</strong> ({nextHoliday.dayOfWeek})
            </Text>
          ) : (
            <Text>Não há próximos feriados.</Text>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
