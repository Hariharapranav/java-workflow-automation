import { useEffect, useState, Fragment } from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import type { Workflow } from '../types';
import { Send, FileText, ChevronRight } from 'lucide-react';

const submitSchema = z.object({
    workflowId: z.string().min(1, 'Please select a workflow'),
    title: z.string().min(3, 'A clear title/subject is required'),
    amount: z.union([z.number(), z.string().transform(v => parseFloat(v) || 0)]).optional(),
    reason: z.string().min(5, 'Please provide a detailed reason'),
});

type SubmitForm = z.infer<typeof submitSchema>;

const SubmitRequest = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useHookForm<SubmitForm>({
        resolver: zodResolver(submitSchema) as any,
        defaultValues: {
            title: '',
            reason: '',
            amount: 0
        }
    });

    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/workflows').then((res: any) => setWorkflows(res.data));
    }, []);

    const onSubmit = async (data: SubmitForm) => {
        try {
            const payload: any = {
                title: data.title,
                reason: data.reason
            };

            // Only attach amount if it's not a leave request
            if (!isLeaveRequest && data.amount !== undefined && data.amount !== null) {
                payload.amount = data.amount;
            }

            await axios.post('/requests', {
                workflowId: parseInt(data.workflowId),
                payloadJson: JSON.stringify(payload)
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to submit request', error);
            alert('Failed to submit request');
        }
    };

    const selectedWorkflowId = watch('workflowId');
    const selectedWorkflow = workflows.find(w => w.id === parseInt(selectedWorkflowId || '0'));

    // Determine the type of workflow to intelligently show/hide fields
    const workflowName = selectedWorkflow?.name?.toLowerCase() || '';
    const isLeaveRequest = workflowName.includes('leave') || workflowName.includes('time off');
    const isPurchaseRequest = workflowName.includes('purchase') || workflowName.includes('vendor') || workflowName.includes('expense');

    return (
        <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl shadow-lg shadow-primary-500/30">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        Submit New Request
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="bg-white/60 p-6 rounded-2xl border border-white">
                            <label className="block text-sm font-bold text-slate-700 mb-3">Select Workflow Path</label>
                            <select
                                {...register('workflowId')}
                                className="mt-1 block flex-1 w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 bg-slate-50 border"
                            >
                                <option value="">Select a workflow path...</option>
                                {workflows.map(wf => (
                                    <option key={wf.id} value={wf.id}>{wf.name}</option>
                                ))}
                            </select>
                            {errors.workflowId && <p className="mt-2 text-sm text-red-600 font-medium">{errors.workflowId.message}</p>}
                        </div>

                        {selectedWorkflow && (
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6 shadow-inner">
                                <h3 className="font-semibold text-slate-900 mb-2">Workflow Description</h3>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{selectedWorkflow.description}</p>
                                <div className="mt-4">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Approval Chain</h4>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100">You (Initiator)</span>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                        {selectedWorkflow.steps.map((step, idx) => (
                                            <Fragment key={idx}>
                                                <span className="px-3 py-1.5 bg-white text-slate-700 text-xs font-semibold rounded-full border shadow-sm border-slate-200">
                                                    {step.name} ({step.requiredRole})
                                                </span>
                                                {idx < selectedWorkflow.steps.length - 1 && <ChevronRight className="w-4 h-4 text-slate-400" />}
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white/60 p-6 rounded-2xl border border-white space-y-5">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Request Details</h3>
                                <p className="text-sm text-slate-500 mb-4">Provide the specific information needed for approval.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className={isLeaveRequest ? "md:col-span-2" : ""}>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Subject / Title</label>
                                    <input
                                        type="text"
                                        {...register('title')}
                                        className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-4 bg-slate-50 transition-all"
                                        placeholder={isLeaveRequest ? "e.g. Annual Vacation (Oct 10 - Oct 15)" : "e.g. Q3 Server Upgrades"}
                                    />
                                    {errors.title && <p className="mt-2 text-sm text-red-600 font-medium">{errors.title.message}</p>}
                                </div>

                                {!isLeaveRequest && (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">
                                            {isPurchaseRequest ? "Total Cost Amount" : "Amount (Optional)"}
                                        </label>
                                        <div className="relative mt-1">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-slate-500 font-semibold">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                {...register('amount', { valueAsNumber: true })}
                                                className="block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-4 pl-8 bg-slate-50 transition-all font-mono"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.amount && <p className="mt-2 text-sm text-red-600 font-medium">{errors.amount.message}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="mt-5">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Detailed Reason</label>
                                <textarea
                                    {...register('reason')}
                                    rows={5}
                                    className="mt-1 block w-full rounded-xl flex-1 border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-4 bg-slate-50 transition-all"
                                    placeholder="Please explain the business justification for this request..."
                                />
                                {errors.reason && <p className="mt-2 text-sm text-red-600 font-medium">{errors.reason.message}</p>}
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end">
                            <button
                                type="submit"
                                className="w-full sm:w-auto flex justify-center py-3.5 px-8 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:shadow-primary-500/30 items-center gap-2 transform hover:-translate-y-0.5"
                            >
                                <Send className="w-5 h-5" />
                                Launch Workflow Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitRequest;
