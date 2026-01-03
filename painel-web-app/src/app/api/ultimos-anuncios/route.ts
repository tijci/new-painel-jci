import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
    try {
        const ultimosAnuncios = await prisma.anuncios.findMany({
            orderBy: { DataHora: 'desc' },
            take: 5,
        })
        if (!ultimosAnuncios) {
            return NextResponse.json(
                { message: "Nenhum anuncio encontrado." },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: "Ultimos Anuncios!",
            success: true,
            dados: ultimosAnuncios
        }, { status: 200 });
    } catch (e) {
        console.error("Erro ao buscar anuncios no Banco: ", e);
        return NextResponse.json(
            { message: "Erro interno ao buscar anuncios." },
            { status: 500 }
        );
    }


}