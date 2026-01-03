"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface FormData {
    titulo: string,
    corretor: string,
    operacao: string,
}

export default function NovaConquista() {
    const [form, setForm] = useState<FormData>({ titulo: '', corretor: '', operacao: 'Venda' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');


    const [socket, setSocket] = useState<any>(undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value } as FormData);
    };

    useEffect(() => {
        const socketInstance = io();
        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        }
    }, []);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/novo-anuncio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                socket.emit("novo anuncio", data.evento);
                setStatus('success');
                setMessage(`Sucesso! ${data.evento.operacao} de ${data.evento.corretor} ativada no painel`);
                setForm({ titulo: '', corretor: '', operacao: 'Venda' });
            } else {
                setStatus('error');
                setMessage(data.message || 'Erro ao processar a requisição.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Erro interno');
        } finally {
            setTimeout(() => setStatus('idle'), 5000);
        }
    };



    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl space-y-6">

            {/* Campo Título/Imóvel */}
            <label className="block">
                <span className="text-gray-700 font-medium">Título do Anúncio</span>
                <input
                    type="text"
                    name="titulo" // 'name' é crucial para o handleChange
                    value={form.titulo}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </label>

            {/* Campo Corretor */}
            <label className="block">
                <span className="text-gray-700 font-medium">Corretor Responsável</span>
                <input
                    type="text"
                    name="corretor"
                    value={form.corretor}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </label>

            {/* Campo Tipo de Ação (Dropdown) */}
            <label className="block">
                <span className="text-gray-700 font-medium">Tipo de Ocorrência</span>
                <select
                    name="operacao"
                    value={form.operacao}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="Venda">Venda</option>
                    <option value="Locação">Locação</option>
                    <option value="Captação">Captação</option>
                </select>
            </label>

            {/* Botão de Envio */}
            <button
                type="submit"
                disabled={status === 'loading'}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-300 ${status === 'loading'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
            >
                {/* Altera o texto do botão conforme o estado */}
                {status === 'loading' ? 'Ativando...' : 'Ativar Anúncio na TV'}
            </button>

            {/* Feedback de Status (Sucesso/Erro) */}
            {status !== 'idle' && status !== 'loading' && (
                <p className={`text-center p-3 rounded-md font-medium ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message}
                </p>
            )}
            {status === 'success' &&
                <div className="border rounded-lg w-3/4 bg-green-100 flex flex-col justify-center items-start px-4 py-2 max-w-sm mx-auto border-green-700">
                    <h3 className="text-green-700 font-bold">Sucesso!</h3>
                    <p className="text-sm mt">{message}</p>
                </div>
            }
            {status === 'error' &&
                <div className="border rounded-lg w-3/4 bg-red-100 flex flex-col justify-center items-start px-4 py-2 max-w-sm mx-auto border-red-700">
                    <h3 className="text-red-700 font-bold">Erro!</h3>
                    <p className="text-sm mt">{message}</p>
                </div>
            }
        </form>
    );
}
