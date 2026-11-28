# syntax=docker/dockerfile:1

# ---------- base: dependencias exactas del lockfile ----------
FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: evita ejecutar husky (hook "prepare") dentro del contenedor
RUN npm ci --ignore-scripts
COPY . .

# ---------- test: las pruebas unitarias corren DENTRO del contenedor ----------
# Se ejecuta con: docker run --rm <imagen:test>
FROM base AS test
CMD ["npm", "run", "test:coverage"]

# ---------- compile: genera dist/ (sin los ejemplos de src/quality) ----------
FROM base AS compile
RUN npx tsc -p tsconfig.build.json

# ---------- runtime: imagen final, solo dependencias de producción ----------
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY --from=compile /app/dist ./dist
# Usuario sin privilegios (la imagen oficial ya trae "node")
USER node
# Es una librería: la imagen verifica que el paquete cargue correctamente
CMD ["node", "-e", "console.log('exports:', Object.keys(require('./dist')))"]
