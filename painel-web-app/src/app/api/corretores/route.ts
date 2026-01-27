import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nome, operacao, banner } = body;
        if (!nome || !operacao) {
            return NextResponse.json({ message: "Nome e Operação são obrigatórios" }, { status: 400 });
        }

        const novoCorretor = await prisma.corretor.create({
            data: {
                Nome: nome,
                Operacao: operacao,
                BannerUrl: banner || "",
            }
        })

        return NextResponse.json({ message: "Corretor criado com sucesso", success: true }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro interno no servidor", success: false }, { status: 500 });
    }
}

export async function GET() {
    try {
        const corretores = await prisma.corretor.findMany({
            orderBy: {
                Nome: 'asc'
            }
        });
        return NextResponse.json(corretores);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao buscar corretores" }, { status: 500 });
    }

}
