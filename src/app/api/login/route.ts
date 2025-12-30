import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const {code} = await request.json();
    if (!code) {
        return NextResponse.json(
            {message: "Código Não Enviado"},
            {status: 400},
        );
    }
    
    if (code !== process.env.CODE_PANEL) {
        return NextResponse.json(
            {message: "Código Inválido!"},
            {status: 401},
        );
    }
    const response = NextResponse.json(
        {message: "Código Válido!"},
        {status: 200},

    );
    response.cookies.set("session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV==="production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 dia
    });
    return response;
}