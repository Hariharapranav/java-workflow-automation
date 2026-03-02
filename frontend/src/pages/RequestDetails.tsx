import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import type { WorkflowRequest, RequestApproval } from '../types';
import { useAuth } from '../context/AuthContext';
import { Check, X, ArrowLeft, Clock, FileText, User } from 'lucide-react';
import clsx from 'clsx';

const RequestDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [request, setRequest] = useState<WorkflowRequest | null>(null);
    const [approvals, setApprovals] = useState<RequestApproval[]>([]);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reqRes, appRes] = await Promise.all([
                    axios.get(`/requests/${id}`),
                    axios.get(`/requests/${id}/approvals`)
                ]);
                setRequest(reqRes.data);
                setApprovals(appRes.data);
            } catch (error) {
                console.error('Failed to load request', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
        try {
            await axios.post(`/requests/${id}/approve`, { status, comments: comment });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to act on request', error);
            alert('Failed to process action. Make sure you have the required role.');
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
    if (!request) return <div>Request not found</div>;

    const currentStep = request.workflow.steps[request.currentStepIndex];
    const isPending = request.status === 'PENDING';
    const canApprove = isPending && (user?.role === 'ADMIN' || user?.role === currentStep?.requiredRole);

    const payload = JSON.parse(request.payloadJson || '{}');

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-600 transition-colors font-semibold bg-white/50 px-4 py-2 rounded-lg w-fit backdrop-blur-sm shadow-sm border border-white">
                <ArrowLeft className="w-4 h-4 mr-2 text-primary-500" /> Back to Dashboard
            </button>

            <div className="glass-panel rounded-3xl overflow-hidden">
                <div className="px-6 py-5 border-b border-indigo-50/50 bg-white/40 flex justify-between items-center relative z-10">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl shadow-lg shadow-primary-500/30">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        Request #{request.id}: <span className="text-slate-500 font-medium ml-2">{request.workflow.name}</span>
                    </h2>
                    <span className={clsx("px-3 py-1 text-sm font-semibold rounded-full",
                        request.status === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                            request.status === 'REJECTED' ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                    )}>
                        {request.status}
                    </span>
                </div>

                <div className="p-6 md:p-10 space-y-10 relative">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                    <div className="grid grid-cols-2 gap-6 bg-white/60 p-6 rounded-2xl border border-white shadow-sm relative z-10">
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Requester</p>
                                <p className="font-bold text-slate-800 text-lg">
                                    {request.requesterName}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Submitted on</p>
                                <p className="font-bold text-slate-800 text-lg">
                                    {new Date(request.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">Request Details Dataset</h3>
                        <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm">
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                                {JSON.stringify(payload, null, 2)}
                            </pre>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Approval Timeline</h3>
                        <div className="space-y-4">
                            {approvals.map((app, idx) => (
                                <div key={idx} className="flex gap-5 items-start bg-white/80 p-5 rounded-2xl border border-white shadow-sm relative hover:shadow-md transition-all">
                                    <div className={clsx("p-3 rounded-2xl shadow-sm border", app.status === 'APPROVED' ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100")}>
                                        {app.status === 'APPROVED' ? <Check className="w-6 h-6 text-emerald-600" /> : <X className="w-6 h-6 text-red-600" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-slate-900 text-lg">{app.approverName}</p>
                                            <p className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{new Date(app.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">{app.status}</p>
                                        <p className="text-md leading-relaxed text-slate-700">{app.comments || <span className="text-slate-400 italic">Automated approval signature</span>}</p>
                                    </div>
                                </div>
                            ))}
                            {isPending && currentStep && (
                                <div className="flex gap-5 items-start bg-amber-50/50 p-5 rounded-2xl border border-amber-100/50 border-dashed animate-pulse">
                                    <div className="p-3 bg-amber-100 rounded-2xl shadow-sm border border-amber-200">
                                        <Clock className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1 mt-1">
                                        <p className="font-bold text-amber-900 text-lg">Waiting for {currentStep.name}</p>
                                        <p className="text-sm font-semibold text-amber-700/80 uppercase tracking-widest mt-1">Role: {currentStep.requiredRole}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {canApprove && (
                        <div className="mt-8 pt-8 border-t border-slate-200/60 relative z-10">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Your Decision</h3>
                            <textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                placeholder="Add your optional approval or rejection reasoning here..."
                                className="w-full rounded-2xl border border-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-5 bg-white/60 transition-all font-medium"
                                rows={3}
                            />
                            <div className="flex gap-4 mt-6 justify-end items-center">
                                <button
                                    onClick={() => handleAction('REJECTED')}
                                    className="px-6 py-3.5 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 font-bold rounded-xl transition-all border border-red-100 shadow-sm flex items-center gap-2 hover:-translate-y-0.5"
                                >
                                    <X className="w-5 h-5" /> Reject Request
                                </button>
                                <button
                                    onClick={() => handleAction('APPROVED')}
                                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white hover:from-emerald-400 hover:to-emerald-300 font-bold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all hover:-translate-y-0.5"
                                >
                                    <Check className="w-5 h-5" /> Approve Request
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestDetails;
