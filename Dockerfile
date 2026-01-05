# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o código-fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Instalar serve para servir os arquivos estáticos
RUN npm install -g serve

# Copiar o build da stage anterior
COPY --from=builder /app/dist ./dist

# Expor a porta (ajuste conforme necessário)
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["serve", "-s", "dist", "-l", "5000"]
