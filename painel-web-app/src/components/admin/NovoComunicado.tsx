import { ReactFormState } from "react-dom/client";
import { BsFillMegaphoneFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

interface FormData {
    assunto: string,
    mensagem: string,
    prioridade: string,
}

export default function NovoComunicado() {
    const [form, setForm] = useState<FormData>({ assunto: '', mensagem: '', prioridade: 'normal' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState<any>(undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value } as FormData);
    }
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
            const req = await fetch('/api/novo-comunicado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const res = await req.json();
            if (res.success) {
                socket.emit("novo comunicado", res.comunicado);
                setStatus('success');
                setMessage(`Sucesso! Aviso enviado para os painéis da imobiliária!`);
                setForm({ assunto: '', mensagem: '', prioridade: 'normal' });
            } else {
                setStatus('error');
                setMessage(res.message || 'Erro ao processar a requisição!')
            }
        } catch (erro) {
            setStatus('error');
            setMessage('Erro interno');
        } finally {
            setTimeout(() => setStatus('idle'), 5000);
        }
    }


    return (
        <div className="flex flex-col w-full bg-gray-100 max-w-xl rounded-2xl m-10 shadow-lg">
            <div className="bg-gray-200 p-5 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <BsFillMegaphoneFill color="#2B7FFF" />

                    <h1 className="text-xl font-bold text-blue-500">Comunicados Internos</h1>
                </div>
                <p className="text-sm">Envie avisos para toda a Imobiliária!</p>
            </div>
            <div className="px-5 py-5 rounded-b-2xl">
                <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                    <label htmlFor="">Assunto do Comunicado</label>
                    <input type="text"
                        name="assunto"
                        value={form.assunto}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Reunião Geral no Auditório!" className="border rounded-sm px-4 py-2 border-gray-500 " />
                    <label htmlFor="">Mensagem</label>
                    <input type="text"
                        name="mensagem"
                        value={form.mensagem}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Todos estão convocados para uma reunião geral!" className="border rounded-sm px-4 py-2 border-gray-500 " />
                    <label htmlFor="">Prioridade</label>
                    <select name="prioridade" id=""
                        onChange={handleChange}
                        value={form.prioridade}
                        required
                        className="border rounded-sm px-4 py-2 border-gray-500 ">
                        <option value="normal">Normal</option>
                        <option value="alta">Alta</option>
                        <option value="muitoAlta">Muito Alta</option>
                    </select>
                    <button className="bg-blue-500 py-2 h-18 px-5 rounded-lg my-5  hover:cursor-pointer text-white hover:scale-101 transition-all hover:bg-blue-600">Publicar Comunicado!</button>
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