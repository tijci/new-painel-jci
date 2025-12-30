
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { io } from "socket.io-client";

const colorMap = {
  'Venda': { bg: 'bg-green-600', text: 'text-green-200', border: 'border-green-500' },
  'Locação': { bg: 'bg-blue-600', text: 'text-blue-200', border: 'border-blue-500' },
  'Captação': { bg: 'bg-yellow-600', text: 'text-yellow-200', border: 'border-yellow-500' },
};

export default function PainelTV() {
  const [anuncio, setAnuncio] = useState<any>(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const socket = io();
    socket.on("exibir_anuncio", (data) => {
      console.log("Recebi dados: ", data);
      setAnuncio(data);

    });

    const carregarHistorico = async () => {
      try {
        const res = await fetch("/api/ultimos-anuncios");
        const json = await res.json();

        if (json.success) {
          setHistorico(json.dados);
          console.log(historico);
        }

      } catch (e) {
        console.error(e);
      }
    }
    carregarHistorico();
    return () => {
      socket.disconnect();
    }
  }, [])
  useEffect(() => {
    if (anuncio) {
      console.log("Anuncio exibido, iniciando timer de 10s...");
      const timer = setTimeout(() => {
        console.log("Timer acabou!");
        setAnuncio(null);
      }, 10000);
      return () => clearTimeout(timer); // Limpa se mudar o anuncio antes
    }
  }, [anuncio]);
  if (anuncio) {
    // Tipamos o tipo de forma mais segura para usar no mapeamento de cores
    const tipoAnuncio = anuncio.Operacao as 'Venda' | 'Locação' | 'Captação';
    const cor = colorMap[tipoAnuncio];

    return (
      // Uso de classes dinâmicas do Tailwind com Template Literals
      <main className={`flex flex-col items-center justify-center h-screen ${cor.bg} text-white overflow-hidden relative transition-colors duration-500`}>


        <div className="absolute inset-0 bg-black/10 animate-pulse" />

        <div className="z-10 text-center space-y-8 p-16 bg-black/30 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-500">
          <h1 className="text-8xl font-black tracking-tighter drop-shadow-lg uppercase">
            🎉 {anuncio.Operacao.toUpperCase()} REALIZADA! 🎉
          </h1>

          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-yellow-300">
              {anuncio.Titulo}
            </h2>
            <p className="text-3xl opacity-90 font-mono">
              Parabéns ao corretor: <span className="font-extrabold text-white">{anuncio.Corretor}</span>
            </p>
          </div>
        </div>
      </main>
    );
  }

  // TELA DE DESCANSO (STANDBY com Histórico)
  return (
    <main className="flex h-screen overflow-hidden text-slate-200 bg-black ">
      <div className="w-2/3 flex flex-col items-center bg-white justify-center">
        <h1 className="text-6xl font-extralight tracking-widest uppercase border-b-2 border-slate-700 pb-4 mb-10">

        </h1>
        <Image
          src="/logo.png"
          alt="Imagem de espera"
          width={700}
          height={400}
          className=""
        />
        <p className="text-xl font-mono text-black opacity-50">
          Aguardando a próxima grande conquista...
        </p>
        <p className="text-sm font-mono mt-10 opacity-30">
        </p>
      </div>

      <div className="w-1/3 border-l border-slate-700 bg-slate-900 p-10 ">
        <h2 className="text-2xl  font-bold mb-6 text-indigo-400">Histórico de Conquistas</h2>
        <ul className="space-y-4">
          {historico.map((evento: any) => {
            const eventoOperacao = evento.Operacao as 'Venda' | 'Locação' | 'Captação';
            const cor = colorMap[eventoOperacao] || colorMap.Venda;

            return (
              <li
                key={evento.ID} // Usa o ID do DB como chave
                className={`px-4 py-2 mr-5 bg-slate-800 rounded-lg shadow-lg border-l-4 ${cor.border} hover:bg-slate-700 transition-colors`}
              >
                <span className={`text-xs font-bold uppercase ${cor.text}`}>{evento.Operacao}</span>
                <p className="text-lg font-semibold text-white truncate">{evento.Titulo}</p>
                <p className="text-sm text-slate-400">Por: {evento.Corretor}</p>
                <p className="text-xs text-slate-500">
                  {new Date(evento.DataHora).toLocaleTimeString('pt-BR')}
                </p>
              </li>
            );
          })}
        </ul>
        {historico.length === 0 && <p className="text-slate-500 text-center mt-10">Nenhum registro encontrado.</p>}
      </div>
    </main>
  );
}