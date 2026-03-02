import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { WorkflowRequest } from '../types';
import { Clock, CheckCircle2, XCircle, ChevronRight, FileText, Plus, Activity } from 'lucide-react';
import clsx from 'clsx';

const Dashboard = () => {
    const { user } = useAuth();
    const [myRequests, setMyRequests] = useState<WorkflowRequest[]>([]);
    const [allRequests, setAllRequests] = useState<WorkflowRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const [myRes, allRes] = await Promise.all([
                    axios.get('/requests/my'),
                    (user?.role === 'ADMIN' || user?.role === 'MANAGER')
                        ? axios.get('/requests').catch(() => ({ data: [] }))
                        : Promise.resolve({ data: [] })
                ]);

                setMyRequests(myRes.data);
                setAllRequests(allRes.data);
            } catch (error) {
                console.error('Error fetching requests', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [user]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'REJECTED': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-amber-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const base = "px-2.5 py-1 text-xs font-semibold rounded-full";
        switch (status) {
            case 'APPROVED': return clsx(base, "bg-emerald-100 text-emerald-700");
            case 'REJECTED': return clsx(base, "bg-red-100 text-red-700");
            default: return clsx(base, "bg-amber-100 text-amber-700");
        }
    };

    const RequestList = ({ requests, title }: { requests: WorkflowRequest[], title: string }) => (
        <div className="glass-panel overflow-hidden mb-8 rounded-2xl">
            <div className="px-6 py-5 border-b border-indigo-50/50 bg-white/40 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary-500" />
                    {title}
                </h3>
            </div>
            <div className="divide-y divide-slate-100">
                {requests.length === 0 ? (
                    <div className="px-6 py-8 text-center text-slate-500">No requests found.</div>
                ) : (
                    requests.map(req => (
                        <Link key={req.id} to={`/request/${req.id}`} className="block hover:bg-white/60 transition-all duration-200 group relative">
                            <div className="px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-100 transition-all">
                                        {getStatusIcon(req.status)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            Req #{req.id} - {req.workflow.name}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            By {req.requesterName} on {new Date(req.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={getStatusBadge(req.status)}>{req.status}</span>
                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 glass-panel p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user?.name} 👋</h1>
                    <p className="text-slate-500 mt-2 text-md flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary-500" />
                        Here's a summary of your automated workflows.
                    </p>
                </div>
                <Link to="/submit-request" className="mt-6 sm:mt-0 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-6 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-lg hover:shadow-primary-500/30 flex items-center gap-2 transform hover:-translate-y-0.5 z-10">
                    <Plus className="w-5 h-5" /> Create Request
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                    <div className="p-4 bg-primary-50 rounded-xl text-primary-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">My Active Requests</p>
                        <h4 className="text-2xl font-bold text-slate-900">{myRequests.filter(r => r.status === 'PENDING').length}</h4>
                    </div>
                </div>
                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                    <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none"></div>
                        <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600 relative z-10">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-500 text-sm font-medium">Pending Approvals</p>
                            <h4 className="text-2xl font-bold text-slate-900">{allRequests.filter(r => r.status === 'PENDING').length}</h4>
                        </div>
                    </div>
                )}
            </div>

            <RequestList requests={myRequests} title="My Submitted Requests" />

            {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                <RequestList requests={allRequests} title="All Organizational Requests" />
            )}
        </div>
    );
};

export default Dashboard;
