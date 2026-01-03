"use client";

import Comunicados from "@/src/components/admin/Comunicados";
import NovaConquista from "@/src/components/admin/NovaConquista";
import NovoAnuncio from "@/src/components/admin/NovoAnuncio";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";


export default function Admin() {
  const [isLogged, setIsLogged] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const [socket, setSocket] = useState<any>(undefined);


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
            <input type="password" value={code} onChange={(e) => setCode(e.target.value)} className="border rounded-sm px-4 py-2 w-auto" placeholder="Código"></input>
            {error && <p className="text-red-500 text-sm mt-5">{error}</p>}
            <button className="bg-blue-500 py-2 px-5 rounded-lg my-5  hover:cursor-pointer text-white hover:scale-105 transition-all ">Entrar!</button>
          </form>
        </div>
      </div>
    )


  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Painel de Gerenciamento de Anúncios</h1>

      <div className="flex flex-col lg:flex-row lg:gap-10 w-full justify-center items-center h-auto">
        <NovoAnuncio />
        <Comunicados />
      </div>
    </div>
  );
}
