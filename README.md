# 🚀 Guia de Deploy - Painel Web App

## Pré-requisitos do Servidor

O servidor Linux precisa ter instalado:
- **Docker Engine** (versão 20+)
- **Docker Compose** (versão 2+)
- **Git** (para clonar o repositório)

### Verificar instalação:
```bash
docker --version
docker compose version
git --version
```

---

## Passo a Passo

### 1. Clonar o Repositório

```bash
cd /opt  # ou outro diretório de sua preferência
git clone https://github.com/tijci/new-painel-jci.git
cd new-painel-jci/painel-web-app
```

### 2. Configurar Variáveis de Ambiente

Criar o arquivo `.env` com as variáveis de produção:

```bash
nano .env
```

### 3. Criar Diretórios de Persistência (se necessário)

```bash
# Garante que os diretórios existem para os volumes
mkdir -p public/uploads
touch avisos.db
```

### 4. Build e Inicialização

```bash
# Primeira execução (constrói a imagem e inicia)
docker compose up -d --build

# Verificar se está rodando
docker compose ps

# Ver logs em tempo real
docker compose logs -f painel-web
```

### 5. Verificar Funcionamento

Acesse no navegador:
```
http://<IP_DO_SERVIDOR>:3000
```

---

## Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `docker compose up -d` | Inicia o container em background |
| `docker compose down` | Para o container |
| `docker compose logs -f painel-web` | Acompanha logs em tempo real |
| `docker compose restart painel-web` | Reinicia o container |
| `docker compose build --no-cache` | Reconstrói a imagem do zero |

---

## Atualizações Futuras

Para atualizar a aplicação após mudanças no código:

```bash
cd /opt/new-painel-jci/painel-web-app
git pull
docker compose up -d --build
```

---

## Persistência de Dados

Os seguintes dados são persistidos via volumes Docker:

| Dado | Caminho no Host | Caminho no Container |
|------|-----------------|---------------------|
| Banco SQLite | `./avisos.db` | `/app/avisos.db` |
| Uploads | `./public/uploads` | `/app/public/uploads` |


---

## Portas Utilizadas

| Porta | Serviço |
|-------|---------|
| 3000 | Aplicação Web + WebSocket (Socket.io) |

---

## Estrutura do Projeto

```
new-painel-jci/
└── painel-web-app/
    ├── Dockerfile           # Configuração do container
    ├── docker-compose.yml   # Orquestração do serviço
    ├── .dockerignore        # Arquivos ignorados no build
    ├── .env                 # Variáveis de ambiente (NÃO VERSIONAR)
    ├── avisos.db            # Banco de dados SQLite
    ├── public/uploads/      # Arquivos de upload
    └── ...                  # Código fonte da aplicação
```

---

## Troubleshooting

### Container não inicia
```bash
docker compose logs painel-web
```

### Erro de permissão no banco de dados
```bash
chmod 666 avisos.db
```

### Rebuild completo
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Ver uso de recursos
```bash
docker stats painel-web-app-painel-web
```

---

## Informações Técnicas

- **Runtime:** Node.js 24 (Alpine Linux)
- **Framework:** Next.js 16
- **Banco de Dados:** SQLite (via Prisma)
- **WebSocket:** Socket.io
- **Tamanho da Imagem:** ~1.3 GB

---

## Segurança

- A aplicação roda com usuário não-root (`nextjs`)
- Variáveis sensíveis são passadas via `.env` (não embutidas na imagem)
- O banco de dados é montado como volume externo para persistência

---
