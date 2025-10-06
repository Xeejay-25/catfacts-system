import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Welcome from './pages/Welcome';
import Play from './pages/Play';
import Leaderboards from './pages/Leaderboards';
import UserCreate from './pages/UserCreate';
import UserSelect from './pages/UserSelect';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Game from './pages/Game';
import './App.css';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Don't use Layout for Welcome page
  const isWelcomePage = location.pathname === '/';

  if (isWelcomePage) {
    return <Welcome />;
  }

  return (
    <Layout currentUser={currentUser}>
      <Routes>
        <Route path="/play" element={<Play />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/user/create" element={<UserCreate />} />
        <Route path="/user/select" element={<UserSelect />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
