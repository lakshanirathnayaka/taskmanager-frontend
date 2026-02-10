import React, { useState, useEffect } from 'react';
import './App.css';
import TasksDashBoard from './task';
import Signup from './signup';
import Login from './login';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentView('tasks');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentView('tasks');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCurrentView('login');
  };

  return (
    <div className="App">
      {currentView === 'signup' && (
        <Signup 
          onSwitchToLogin={() => setCurrentView('login')} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setCurrentView('signup')}
        />
      )}
      
      {currentView === 'tasks' && user && (
        <TasksDashBoard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;