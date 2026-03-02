import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="glass-panel sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-primary-600 to-primary-400 p-2 rounded-xl shadow-lg shadow-primary-500/30">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <Link to="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
                            AuraFlow
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex space-x-4">
                            <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-semibold transition-all hover:bg-white/50">
                                Dashboard
                            </Link>
                            <Link to="/submit-request" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-semibold transition-all hover:bg-white/50">
                                New Request
                            </Link>
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin/workflows" className="text-slate-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-semibold transition-all hover:bg-white/50">
                                    Workflows Admin
                                </Link>
                            )}
                        </div>
                        <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
                            <div className="flex flex-col text-right">
                                <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider">{user?.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
