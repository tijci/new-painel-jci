"use client";
import { BsFillMegaphoneFill } from "react-icons/bs";
import { BsPersonFill } from "react-icons/bs";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface FormData {
    titulo: string,
    corretor: string,
    operacao: string,
}


export default function NovoAnuncio() {
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
                setMessage(`Sucesso! ${data.evento.Operacao} de ${data.evento.Corretor} ativada no painel!`);
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
        <div className="flex flex-col w-full bg-gray-100 max-w-xl rounded-2xl m-10 shadow-lg">
            <div className="bg-gray-200 p-5 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <BsFillMegaphoneFill color="#00C950" />

                    <h1 className="text-xl font-bold text-green-500">Nova Conquista!</h1>
                </div>
                <p className="text-sm">Avise a nova conquista para toda a Imobiliária!</p>
            </div>
            <div className="px-5 py-5 rounded-b-2xl">
                <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                    <label htmlFor="">Título da Conquista</label>
                    <input type="text"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Casa de 3.500.000 vendido!"
                        className="border rounded-sm px-4 py-2 border-gray-500 "
                    />
                    <label htmlFor="">Corretor</label>
                    <input type="text"
                        name="corretor"
                        value={form.corretor}
                        onChange={handleChange}
                        required
                        placeholder="Ex: João da Silva"
                        className="border rounded-sm px-4 py-2 border-gray-500 "
                    />
                    <label htmlFor="">Operação</label>
                    <select
                        name="operacao"
                        value={form.operacao}
                        onChange={handleChange}
                        required
                        className="border rounded-sm px-4 py-2 border-gray-500 ">
                        <option value="Venda">Venda</option>
                        <option value="Locação">Locação</option>
                        <option value="Captação">Captação</option>
                    </select>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full py-3 h-18 my-5 px-4 rounded-lg text-white font-semibold transition duration-300 ${status === 'loading'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {/* Altera o texto do botão conforme o estado */}
                        {status === 'loading' ? 'Publicando...' : 'Publicar Anúncio!'}
                    </button>


                </form>
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
            </div>
        </div>
    )
}