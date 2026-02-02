# MovieBox

MovieBox é uma aplicação web completa que permite aos usuários explorar um catálogo de filmes, buscar por títulos,
ver detalhes e gerenciar uma lista pessoal de favoritos. O projeto foi desenvolvido, utilizando NestJS para o backend
e Vue 3 para o frontend.

# Tecnologias Utilizadas

**Backend**: NestJS, Prisma, SQLite, bcrypt, Axios  
**Frontend**: Vue 3, Vite, Pinia, Vue Router, TypeScript
**Testes**: Jest
**Container**: Docker

# Estrutura do Projeto

Disponível em [ProjectTree.md](./ProjectTree.md)

# Como executar (com Docker):

1. Clone o repositório.
2. Crie um arquivo `.env` na pasta `backend` com a variável TMDB_API_KEY e atribua o valor da sua chave da API do TMDb.
3. Na raiz do projeto, execute `docker compose up --build`.
4. Em um novo terminal, execute a migração do banco de dados com:
   `docker compose exec backend npx prisma migrate dev --name init`
5. Acesse a aplicação frontend em `http://localhost:5173`.

# Como executar (sem Docker):

1. Clone o repositório.
2. Navegue até a pasta `backend` e instale as dependências com `npm install`.
3. Crie um arquivo `.env` na pasta `backend` com a variável TMDB_API_KEY e atribua o valor da sua chave da API do TMDb.
4. Execute a migração do banco de dados com `npx prisma migrate dev --name init`.
5. Inicie o servidor backend com `npm run start:dev`.
6. Navegue até a pasta `frontend` e instale as dependências com `npm install`.
7. Inicie o servidor frontend com `npm run dev`.
8. Acesse a aplicação frontend em `http://localhost:5173`.

# Testes

Para executar os testes automatizados do backend, navegue até a pasta `backend` e execute o comando:
`npm run test`.
