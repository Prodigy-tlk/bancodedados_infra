# Migração para Next.js

Arquivos gerados para rodar este projeto com Next.js.

Passos rápidos:

1. Instale dependências:

```bash
npm install
```

2. Rode em modo desenvolvimento:

```bash
npm run dev
```

3. Acesse http://localhost:3000

Observações:
- A pasta `media/` foi listada e deve estar em `public/media/` (o próximo passo do script moverá a pasta automaticamente se executado).
- O código cliente (Firebase + DOM) foi colocado em `public/static/main.js` e é carregado no cliente.
