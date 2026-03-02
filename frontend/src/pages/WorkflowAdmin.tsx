import { useEffect, useState } from 'react';
import { useForm as useHookForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from '../services/api';
import type { Workflow } from '../types';
import { Plus, Trash2, Save, FileSignature, Settings, X } from 'lucide-react';

const stepSchema = z.object({
    name: z.string().min(2, 'Step name is required'),
    requiredRole: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
});

const workflowSchema = z.object({
    name: z.string().min(3, 'Workflow name is required'),
    description: z.string().min(5, 'Description is required'),
    steps: z.array(stepSchema).min(1, 'At least one step is required'),
});

type WorkflowForm = z.infer<typeof workflowSchema>;

const WorkflowAdmin = () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const fetchWorkflows = async () => {
        try {
            const res = await axios.get('/workflows');
            setWorkflows(res.data);
        } catch (error) {
            console.error('Failed to fetch workflows', error);
        }
    };

    const deleteWorkflow = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this workflow?')) return;
        try {
            await axios.delete(`/workflows/${id}`);
            fetchWorkflows();
        } catch (error) {
            console.error('Failed to delete workflow', error);
            alert('Failed to delete. It might be in use.');
        }
    };



    const WorkflowFormEditor = ({
        onSave, onCancel
    }: {
        onSave: (data: WorkflowForm) => void;
        onCancel: () => void;
    }) => {
        const { register, control, handleSubmit, formState: { errors } } = useHookForm<WorkflowForm>({
            resolver: zodResolver(workflowSchema),
            defaultValues: {
                name: '',
                description: '',
                steps: [{ name: 'Manager Approval', requiredRole: 'MANAGER' }]
            }
        });

        const { fields, append, remove } = useFieldArray({
            control,
            name: "steps"
        });

        return (
            <form onSubmit={handleSubmit(onSave)} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 mt-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 bg-primary-500 h-full"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileSignature className="w-5 h-5 text-primary-500" />
                        Create Workflow definition
                    </h3>
                    <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Workflow Name</label>
                        <input
                            {...register('name')}
                            placeholder="e.g. Leave Request, Expense Claim"
                            className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-slate-50 border p-3"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <input
                            {...register('description')}
                            placeholder="Short description of the workflow purpose"
                            className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-slate-50 border p-3"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                    </div>
                </div>

                <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <Settings className="w-4 h-4 text-slate-500" />
                            Approval Chain Steps
                        </h4>
                        <button
                            type="button"
                            onClick={() => append({ name: '', requiredRole: 'MANAGER' })}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-primary-100 shadow-sm transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add Step
                        </button>
                    </div>

                    <div className="space-y-4">
                        {fields.map((field: any, index: number) => (
                            <div key={field.id} className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex flex-col flex-1">
                                    <label className="sr-only">Step Name</label>
                                    <input
                                        {...register(`steps.${index}.name`)}
                                        placeholder={`Step ${index + 1} Name`}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 bg-slate-50 border"
                                    />
                                    {errors.steps?.[index]?.name && <p className="mt-1 text-sm text-red-600">{errors.steps[index].name.message}</p>}
                                </div>

                                <div className="flex flex-col w-48">
                                    <label className="sr-only">Role Required</label>
                                    <select
                                        {...register(`steps.${index}.requiredRole`)}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-3 bg-slate-50 border"
                                    >
                                        <option value="MANAGER">Manager</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>

                                <div className="flex items-center pt-1">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {errors.steps && <p className="mt-2 text-sm text-red-600 font-medium">{errors.steps.message}</p>}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 justify-center py-3.5 px-8 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:shadow-primary-500/30 hover:-translate-y-0.5"
                    >
                        <Save className="w-5 h-5" /> Save Workflow
                    </button>
                </div>
            </form>
        );
    };

    const handleSave = async (data: WorkflowForm) => {
        try {
            await axios.post('/workflows', data);
            setIsAdding(false);
            fetchWorkflows();
        } catch (error) {
            console.error('Failed to save workflow', error);
            alert('Failed to save workflow');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center glass-panel p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Workflow Administration</h2>
                    <p className="text-md text-slate-500 mt-2">Configure approval chains and enterprise workflows dynamically.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="mt-6 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3.5 rounded-xl font-bold hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg hover:shadow-primary-500/30 tracking-wide transform hover:-translate-y-0.5 relative z-10"
                    >
                        <Plus className="w-5 h-5" /> Create New Workflow
                    </button>
                )}
            </div>

            {isAdding && (
                <WorkflowFormEditor onSave={handleSave} onCancel={() => setIsAdding(false)} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {workflows.map((wf) => (
                    <div key={wf.id} className="glass-panel overflow-hidden rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative">
                        <div className="px-6 py-6 border-b border-indigo-50/50 bg-white/40 flex justify-between items-center relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-primary-400 transition-all">{wf.name}</h3>
                                <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">{wf.description}</p>
                            </div>
                            <button
                                onClick={() => deleteWorkflow(wf.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                title="Delete Workflow"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Settings className="w-3.5 h-3.5" /> Approval Chain ({wf.steps.length} Steps)
                            </h4>
                            <div className="space-y-3">
                                {wf.steps.map((step, idx) => (
                                    <div key={idx} className="flex justify-between text-sm py-2 border-b border-dashed border-slate-200 last:border-0">
                                        <span className="font-semibold text-slate-700">Step {idx + 1}: {step.name}</span>
                                        <span className="text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded-md font-mono">{step.requiredRole}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {workflows.length === 0 && !isAdding && (
                    <div className="col-span-1 lg:col-span-2 text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <FileSignature className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No workflows defined</h3>
                        <p className="mt-1 text-slate-500">Get started by creating a new workflow template.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkflowAdmin;
