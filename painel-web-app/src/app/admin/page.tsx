"use client";

import { use, useEffect, useState } from "react";
import { io } from "socket.io-client";

interface FormData {
  titulo: string,
  corretor: string,
  operacao: string,
}

export default function Home() {
  const [form, setForm] = useState<FormData>({ titulo: '', corretor: '', operacao: 'Venda' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const [socket, setSocket] = useState<any>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value } as FormData);
  };

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("api/me");
      if (res.ok) {
        setIsLogged(true);
      }
    }
    checkAuth();
  }, [])

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


  // ===================
  // = LOGIN DO PAINEL =
  // ===================

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const loginCheck = await fetch("/api/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await loginCheck.json();
      if (loginCheck.ok) {
        setIsLogged(true);
      } else {
        setError(data.message);
        return;
      }

    } catch (e) {
      setError("Erro: " + e);
    }
  }

  if (!isLogged) {
    return (
      <div className="h-full w-full flex justify-center items-center p-5">
        <div className="flex flex-col bg-gray-100 h-auto w-sm min-w-[250px] mx-10 rounded-2xl shadow-2xl p-5">
          <h1 className="font-bold text-2xl text-center mb-3">Chave de Acesso</h1>
          <form onSubmit={onSubmit} className="flex flex-col  items-center justify-center h-full">
            <label>Insira seu acesso do painel!</label>
            <input type="password" value={code} onChange={(e) => setCode(e.target.value)} className="border-1 rounded-sm px-4 py-2 w-auto" placeholder="Código"></input>
            {error && <p className="text-red-500 text-sm mt-5">{error}</p>}
            <button className="bg-blue-500 py-2 px-5 rounded-lg my-5  hover:cursor-pointer text-white hover:scale-105 transition-all ">Entrar!</button>
          </form>
        </div>
      </div>
    )


  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Painel de Ativação de Anúncios</h1>
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
      </form>
    </div>
  );
}
