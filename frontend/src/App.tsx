import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import WorkflowAdmin from './pages/WorkflowAdmin';
import SubmitRequest from './pages/SubmitRequest';
import RequestDetails from './pages/RequestDetails';
import Navbar from './components/Navbar';

const PrivateRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role && user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Router>
      <div className="min-h-screen bg-mesh flex flex-col font-sans text-slate-900 selection:bg-primary-200">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            <Route path="/submit-request" element={
              <PrivateRoute>
                <SubmitRequest />
              </PrivateRoute>
            } />

            <Route path="/request/:id" element={
              <PrivateRoute>
                <RequestDetails />
              </PrivateRoute>
            } />

            <Route path="/admin/workflows" element={
              <PrivateRoute role="ADMIN">
                <WorkflowAdmin />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
