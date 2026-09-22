# Stockfull — Frontend

Interface web do Stockfull, sistema de controle de estoque para restaurantes. Esta é a SPA em React que consome a API do backend ([stockfull-backend](https://github.com/tiagosalgad0/stockfull-backend)).

> Para entender o sistema como um todo (o que ele faz, manual de uso, arquitetura, como o backend e o banco de dados se encaixam), veja o **[README do projeto](../README.md)**. Este arquivo cobre só a parte de frontend.

## Stack

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- [React Router 7](https://reactrouter.com/) para as rotas
- [Oxlint](https://oxc.rs/) para lint
- CSS puro, sem framework de UI

## Estrutura

```
src/
├── app/            # rotas (routes.jsx) e providers globais (AuthProvider, ToastProvider)
├── components/     # componentes reutilizáveis (ui/, layout/, branding/)
├── features/       # uma pasta por área do sistema
│   ├── auth/           # tela de login
│   ├── dashboard/      # resumo e alertas
│   ├── ingredientes/   # cadastro de ingredientes ("Estoque")
│   ├── fechamento/     # abertura, registro e encerramento do período mensal
│   ├── compras/        # lista de compras gerada
│   └── historico/      # consulta de fechamentos anteriores
├── hooks/          # ex.: useEstoqueAtual, que reúne os dados do período em andamento
└── services/api/   # cliente HTTP central (apiClient.js) — token, erros, paginação
```

Cada feature segue o mesmo padrão: `pages/` (telas), `components/` (quando a feature tem componentes próprios) e `services/` (chamadas à API daquela área).

## Como rodar localmente

Pré-requisitos: [Node.js 20+](https://nodejs.org/) e o backend rodando (veja [`backend/README` — instalação](../README.md#instalação-e-execução-local)).

```powershell
npm install
copy .env.example .env
npm run dev
```

A aplicação sobe em `http://localhost:5173`. O valor padrão de `VITE_API_URL` (`/api`) já funciona em desenvolvimento: o Vite faz *proxy* de `/api` para `http://127.0.0.1:8000`, onde o backend deve estar rodando (veja [`vite.config.js`](vite.config.js)).

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | sobe o servidor de desenvolvimento com hot reload |
| `npm run build` | gera o build de produção em `dist/` |
| `npm run preview` | serve localmente o build gerado, para conferir antes do deploy |
| `npm run lint` | roda o Oxlint |

## Variáveis de ambiente

| Variável | Para que serve |
|---|---|
| `VITE_API_URL` | endereço base da API. Em desenvolvimento, `/api` (usa o proxy do Vite). Em produção, a URL completa do backend publicado, ex.: `https://stockfull-backend.vercel.app/api` |

## Deploy

Publicado na [Vercel](https://vercel.com/) direto deste repositório, com deploy automático a cada push. O build é o padrão do Vite (`npm run build`); [`vercel.json`](vercel.json) redireciona todas as rotas para `index.html`, necessário porque as rotas são controladas pelo React Router no navegador (SPA). A variável `VITE_API_URL` é configurada no painel do projeto na Vercel, apontando para a URL pública do backend.
