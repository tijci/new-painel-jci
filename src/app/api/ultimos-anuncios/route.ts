import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
    const ultimosAnuncios = await prisma.anuncios.findMany({
        orderBy: { DataHora: 'desc' },
        take: 5,
    })

    return NextResponse.json({
        message: "Ultimos Anuncios!",
        success: true,
        dados: ultimosAnuncios
    }, { status: 200 });
}