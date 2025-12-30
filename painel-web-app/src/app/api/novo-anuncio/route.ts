import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

interface eventosDados {
    titulo: string,
    corretor: string,
    operacao: string,
}


export async function POST(request: Request) {
    const data: eventosDados = await request.json();
    if (!data) {
        return NextResponse.json(
            { message: "Dados não enviados!" },
            { status: 400 },
        );
    }
    let enviar;
    try {
        enviar = await prisma.anuncios.create({
            data: {
                Titulo: data.titulo,
                Corretor: data.corretor,
                Operacao: data.operacao,
            },
        });
    } catch (e) {
        console.error("Problema ao Registrar no Banco: ", e);
    }
    return NextResponse.json(
        {
            message: "Anúncio Registrado!",
            success: true,
            evento: enviar
        },
        { status: 200 },
    );



}