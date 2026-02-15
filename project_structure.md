/
├── .cursorrules           # Instructions for Cursor AI Agent
├── .env                   # Environment variables (Secrets)
├── .gitignore             # Git ignore file
├── docker-compose.yml     # Docker configuration
├── package.json           # Root package manager
├── package-lock.json      # Dependency lock file
├── README.md              # Project documentation
├── PROJECT_STRUCTURE.md   # This documentation file
│
├── /client                # Frontend Application (v0 generated)
│
└── /server                # Backend Application (Node.js, Express)
    ├── /src
    │   ├── /config        # Database connection & DB init (db.js, db.docs.js, dbInit.js)
    │   ├── /controllers   # Request handlers (signin.controller.js, signUp.controller.js)
    │   ├── /middlewares   # Express middlewares (auth.middleware.js)
    │   ├── /routes        # API route definitions (auth, chat, upload, etc.)
    │   ├── /services      # Business logic & external services (embedding, vector, docs)
    │   └── /utils         # Shared utilities (llm.service.js, resetChroma.js)
    ├── /node_modules      # Installed dependencies
    ├── .env               # Server-specific env variables
    ├── package.json
    ├── package-lock.json
    ├── server.js          # Entry point
    └── testPipeline.js    # Test script
