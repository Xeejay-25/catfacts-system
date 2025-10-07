import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Play from './pages/Play';
import Leaderboards from './pages/Leaderboards';
import UserCreate from './pages/UserCreate';
import UserSelect from './pages/UserSelect';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Game from './pages/Game';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/play" element={<Play />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/user/create" element={<UserCreate />} />
        <Route path="/user/select" element={<UserSelect />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
