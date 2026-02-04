import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import { setNavigate } from './utils/navigation';

// Component to set up navigation utility
const NavigationSetup = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigationSetup>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Todo App
                      </h1>
                      <p className="text-gray-600">
                        Welcome! Your todo app will be built here.
                      </p>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NavigationSetup>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

