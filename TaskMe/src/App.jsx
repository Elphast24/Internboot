import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={currentUser ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={currentUser ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;