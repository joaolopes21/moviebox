/moviebox
├── backend/                 # Aplicação Backend (NestJS)
│   ├── prisma/              # Schema e migrações do banco de dados
│   ├── src/
│   │   ├── auth/            # Módulo de autenticação (cadastro/login)
│   │   ├── favorites/       # Módulo de gerenciamento de favoritos
│   │   ├── movies/          # Módulo de integração com TMDb
│   │   └── ...
│   ├── test/                # Testes automatizados (Jest)
│   ├── .env                 # Variáveis de ambiente
│   └── Dockerfile           # Configuração do container do backend
│
├── frontend/                # Aplicação Frontend (Vue 3)
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── views/           # Páginas da aplicação
│   │   ├── services/        # Camada de comunicação com a API
│   │   ├── stores/          # Stores de estado (Pinia)
│   │   └── ...
│   └── Dockerfile           # Configuração do container do frontend
│
└── docker-compose.yml       # Orquestração dos serviços (backend + frontend)