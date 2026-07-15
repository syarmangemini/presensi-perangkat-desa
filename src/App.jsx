import { useState } from 'react';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import Profile from './components/Profile'

function App() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState('perangkat');
  const [view, setView] = useState('dashboard'); // perangkat view: 'dashboard' | 'profile'

  const logout = () => {
    setAuthed(false);
    setView('dashboard');
  };

  if (!authed) {
    return <Login onSuccess={(r) => { setRole(r); setAuthed(true); }} />;
  }
  if (role === 'perangkat') {
    return view === 'dashboard' ? (
      <Dashboard onNavigate={setView} onLogout={logout} />
    ) : (
      <Profile onNavigate={setView} onLogout={logout} />
    );
  }
  return <AdminPanel onLogout={logout} />;
}

export default App
