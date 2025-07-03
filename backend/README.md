```
.
└── backend/
    ├── dis                               # OUT DIR
    ├── node_modules                      # Node Dependencies
    ├── prisma                            # DB Models and Migrations/
    │   ├── migrations                    # Migrations
    │   └── schema.prisma                 # Prisma DB config
    ├── src                               # Buisness Logic/
    │   ├── config                        # Configurations files/
    │   │   ├── dbConfig.ts               # Postgres Configuratons
    │   │   └── ....
    │   ├── controllers/                  # Controllers Logic/
    │   │   ├── admin.controller.ts
    │   │   ├── export.controller.ts
    │   │   ├── feedback.controller.ts
    │   │   └── ....
    │   ├── routes                        # Routes/
    │   │   ├── admin.routes.ts
    │   │   ├── export.routes.ts
    │   │   └── feedback.routes.ts
    │   ├── services/
    │   │   └── ....
    │   ├── types                          # Types interfaces/
    │   │   └── index.ts
    │   ├── utils/
    │   │   └── hashedPassword.ts
    │   └── index.ts
    ├── .env
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── tsconfig.json
    └── tsconfig.tsbuildinfo
    
```