import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

interface comunicadoDados {
    assunto: string,
    mensagem: string,
    prioridade: string,
}


export async function POST(request: Request) {
    const data: comunicadoDados = await request.json();
    if (!data) {
        return NextResponse.json(
            { message: "Dados não enviados!" },
            { status: 400 },
        );
    }
    let enviar;
    try {
        enviar = await prisma.comunicados.create({
            data: {
                Assunto: data.assunto,
                Mensagem: data.mensagem,
                Prioridade: data.prioridade,
            },
        });
    } catch (e) {
        console.error("Problema ao Registrar no Banco: ", e);
        return NextResponse.json(
            { message: "Erro interno ao salvar comunicado." },
            { status: 500 }
        );
    }
    return NextResponse.json(
        {
            message: "Comunicado Enviado!",
            success: true,
            comunicado: enviar
        },
        { status: 200 },
    );
}