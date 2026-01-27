
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { io } from "socket.io-client";

interface ItemFila {
  id: string,
  tipo: 'anuncio' | 'comunicado',
  payload: any,
}

const colorMap = {
  'Venda': { bg: 'bg-green-600', text: 'text-green-200', border: 'border-green-500' },
  'Locação': { bg: 'bg-blue-600', text: 'text-blue-200', border: 'border-blue-500' },
  'Captação': { bg: 'bg-yellow-600', text: 'text-yellow-200', border: 'border-yellow-500' },
};


export default function PainelTV() {
  const [comunicado, setComunicado] = useState<any>(null);
  const [anuncio, setAnuncio] = useState<any>(null);
  const [historico, setHistorico] = useState<any[]>([]);

  const [itemAtual, setItemAtual] = useState<ItemFila | null>(null);
  const [fila, setFila] = useState<ItemFila[]>([]);

  useEffect(() => {
    if (itemAtual || fila.length === 0) return;

    const proximoItem = fila[0];

    setItemAtual(proximoItem);
    setFila((prev) => prev.slice(1));

  }, [itemAtual, fila]);

  useEffect(() => {
    if (!itemAtual) return;

    const tempoExibicao = 10000;
    const timer = setTimeout(() => {
      setItemAtual(null);
    }, tempoExibicao);

    return () => clearTimeout(timer);
  }, [itemAtual]);

  useEffect(() => {
    const socket = io();
    socket.on("connect", () => {
      console.log("🟢 TV Conectada ao Servidor! ID:", socket.id);
    });
    socket.on("exibir_anuncio", (data) => {
      setFila((prev) => [...prev, { id: crypto.randomUUID(), tipo: 'anuncio', payload: data }]);
      setAnuncio(data);

      setHistorico((prev: any) => {
        const novoItem = {
          ...data,
          DataHora: data.DataHora || new Date().toISOString(), // Garante que tenha data
          ID: data.ID || crypto.randomUUID() // Garante ID para a key do React
        };
        return [novoItem, ...prev].slice(0, 5);
      });
    });
    socket.on("exibir_comunicado", (data) => {
      setFila((prev) => [...prev, { id: crypto.randomUUID(), tipo: 'comunicado', payload: data }]);
      setComunicado(data);
    });

    const carregarHistorico = async () => {
      try {
        const res = await fetch("/api/ultimos-anuncios");
        const json = await res.json();

        if (json.success) {
          setHistorico(json.dados);
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
      const timer = setTimeout(() => {
        setAnuncio(null);
      }, 10000);
      return () => clearTimeout(timer); // Limpa se mudar o anuncio antes
    }
  }, [anuncio]);

  useEffect(() => {
    if (comunicado) {
      const timer = setTimeout(() => {
        setComunicado(null);

      }, 10000);
      return () => clearTimeout(timer); // Limpa se mudar o comunicado antes
    }
  }, [comunicado]);



  if (itemAtual) {
    if (itemAtual.tipo == 'anuncio') {
      const anuncio = itemAtual.payload;
      const tipoAnuncio = anuncio.Operacao as 'Venda' | 'Locação' | 'Captação';
      const cor = colorMap[tipoAnuncio];
      return (
        // Uso de classes dinâmicas do Tailwind com Template Literals

        <main className={`flex flex-col items-center justify-center h-screen bg-white text-white overflow-hidden relative transition-colors duration-500`}>

          <Image
            src={anuncio.BannerUrl}
            alt="Banner"
            width={1920}
            height={1080}
            priority // Força o carregamento imediato da imagem
            className="object-contain" // Garante que a imagem se ajuste bem
          />
          <div className="absolute inset-0 bg-black/10 animate-pulse" />


        </main>
      );
    }
    if (itemAtual.tipo == 'comunicado') {
      const comunicado = itemAtual.payload;
      const prioridadeMap: any = {
        'normal': 'bg-blue-600',
        'alta': 'bg-orange-600',
        'muitoAlta': 'bg-red-600 animate-pulse'
      };
      const bgClass = prioridadeMap[comunicado.Prioridade] || 'bg-blue-600';

      return (
        <div className={`flex flex-col items-center justify-start h-screen ${bgClass}  `}>
          <Image
            src="/logo-branca.webp"
            alt="Logo branca"
            width={300}
            height={300}
            className="my-20"
          />
          <main className={`flex flex-col items-center justify-center  text-white p-20 text-center`}>
            <h1 className="text-6xl font-black mb-10 border-b-4 border-white pb-4">{comunicado.Assunto}</h1>
            <p className="text-4xl font-medium leading-relaxed">{comunicado.Mensagem}</p>
            <div className="absolute bottom-10 text-white/50 text-xl font-mono">
              ⚠️ Comunicado Oficial
            </div>
          </main>
        </div>

      )
    }

  }


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