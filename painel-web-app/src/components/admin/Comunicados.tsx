import { BsFillMegaphoneFill } from "react-icons/bs";


export default function Comunicados() {

    return (
        <div className="flex flex-col bg-gray-100 max-w-2xl mx-auto rounded-2xl m-10 shadow-lg">
            <div className="bg-gray-200 p-5 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <BsFillMegaphoneFill color="#2B7FFF" />

                    <h1 className="text-xl font-bold text-blue-500">Comunicados Internos</h1>
                </div>
                <p className="text-sm">Envie avisos para toda a Imobiliária!</p>
            </div>
            <div className="px-5 py-5 rounded-b-2xl">
                <form className="flex flex-col gap-1" action="">
                    <label htmlFor="">Assunto do Comunicado</label>
                    <input type="text" className="border-1 rounded-sm px-4 py-2" />
                    <label htmlFor="">Mensagem</label>
                    <input type="text" className="border-1 rounded-sm px-4 py-2" />
                    <label htmlFor="">Prioridade</label>
                    <select name="" id="" className="border-1 rounded-sm px-4 py-2">
                        <option value="normal">Normal</option>
                        <option value="alta">Alta</option>
                        <option value="muitoAlta">Muito Alta</option>
                    </select>
                    <button className="bg-blue-500 py-2 h-18 px-5 rounded-lg my-5  hover:cursor-pointer text-white hover:scale-101 transition-all ">Publicar Comunicado!</button>
                </form>
            </div>
        </div>
    )
}