import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MaxFibra from './MaxFibra'; // Corrigir caminho se necessário
import VirTelecom from './VirTelecom';
import ReisServices from './ReisServices';
import Contact from './Contact';


const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/max-fibra" element={<MaxFibra />} />
          <Route path="/vir-telecom" element={<VirTelecom />} />
          <Route path="/reis-services" element={<ReisServices />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
