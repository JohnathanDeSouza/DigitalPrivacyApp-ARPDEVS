# BridgeAura Backend (Express)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start server:
```bash
npm start
```

Server runs on port 3000 by default. Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Notes
- This is an in-memory demo. Data resets on server restart.
- Passwords are stored in plaintext — use bcrypt in production.
- JWT secret defaults to `supersecretkey`; set `JWT_SECRET` env var for production.
