import React from 'react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { User, Mail, Lock } from 'lucide-react';

const signupSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
});

type SignupForm = z.infer<typeof signupSchema>;

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useHookForm<SignupForm>({
        resolver: zodResolver(signupSchema),
        defaultValues: { role: 'EMPLOYEE' }
    });
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = React.useState('');

    const onSubmit = async (data: SignupForm) => {
        try {
            await axios.post('/auth/signup', data);
            navigate('/login');
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-white/60 pb-12 relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 shadow-lg shadow-primary-500/30 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl">
                            <User className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                        Join AuraFlow
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
                            {errorMsg}
                        </div>
                    )}
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <label className="sr-only" htmlFor="name">Name</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="name"
                                type="text"
                                required
                                className="appearance-none rounded-t-xl rounded-b-xl relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-slate-50/50"
                                placeholder="Full Name"
                                {...register('name')}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 absolute">{errors.name.message}</p>}
                        </div>

                        <div className="relative mt-4">
                            <label className="sr-only" htmlFor="email-address">Email address</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="email-address"
                                type="email"
                                required
                                className="appearance-none rounded-t-xl rounded-b-xl relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-slate-50/50 mt-6"
                                placeholder="Email address"
                                {...register('email')}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 absolute">{errors.email.message}</p>}
                        </div>

                        <div className="relative mt-4">
                            <label className="sr-only" htmlFor="password">Password</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                className="appearance-none rounded-t-xl rounded-b-xl relative block w-full px-3 py-3 pl-10 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-slate-50/50 mt-6"
                                placeholder="Password"
                                {...register('password')}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 absolute">{errors.password.message}</p>}
                        </div>

                        <div className="relative mt-4 select-wrapper" style={{ marginTop: '1.5rem' }}>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Select Your Role</label>
                            <select
                                {...register('role')}
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/70 shadow-sm"
                            >
                                <option value="EMPLOYEE">Employee (Submit Requests)</option>
                                <option value="MANAGER">Manager (Approval Rights)</option>
                                <option value="ADMIN">Admin (Full System Access)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 relative z-10">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
